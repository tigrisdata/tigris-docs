# Quickstart: Go

:::tip
⏱ This guide should require less than 5 minutes

:::

This guide shows how to integrate Tigris with the backend of microservice architecture
application, using simplified eCommerce service implementation.

## Setting up local Tigris environment

### Prerequisites

- macOS or Linux machine
- Git
- [Docker](https://docs.docker.com/get-docker/)
- [Golang 1.18 or newer](https://go.dev/dl/)
- Curl

### Startup Tigris locally via Docker

Use below links to install the CLI for your operating system.

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

<Tabs>
<TabItem value="macOS" label="macOS">

```shell
curl -sSL https://tigris.dev/cli-macos | sudo tar -xz -C /usr/local/bin
```

</TabItem>
<TabItem value="Linux" label="Linux">

```shell
curl -sSL https://tigris.dev/cli-linux | sudo tar -xz -C /usr/local/bin
```

</TabItem>
</Tabs>

Now we start up Tigris locally using the _tigris_ cli

```shell
tigris local up
```

Once this command has completed, Tigris server will be available on port
`8081`.

## Setting up and starting the service

### Clone the starter application code repository

```shell
git clone https://github.com/tigrisdata/tigris-starter-go.git
cd tigris-starter-go
```

### Compile and start the application

```shell
go build .
./tigris-starter-go
```

## Testing the service

Open new terminal window and run the following commands to test the service

### Insert users

Run following commands to create two users: Jane and John

```shell
curl -X POST localhost:8080/users/create -H 'Content-Type: application/json' \
	 -d '{"id":1,"Name":"John","Balance":100}'
curl -X POST localhost:8080/users/create -H 'Content-Type: application/json' \
	 -d '{"id":2,"Name":"Jane","Balance":200}'
```

### Insert products

Run the following command to insert two products: Avocado and Gold

```shell
curl -X POST localhost:8080/products/create -H 'Content-Type: application/json' \
	 -d '{"id":1,"Name":"Avocado","Price":10,"Quantity":5}'
curl -X POST localhost:8080/products/create -H 'Content-Type: application/json' \
	 -d '{"id":2,"Name":"Gold","Price":3000,"Quantity":1}'
```

### Place some orders

#### Low balance

The next order will fail because John is trying to purchase 1 unit of Gold which costs 3000,
while John's balance is 100.

```shell
curl -X POST localhost:8080/orders/create -H 'Content-Type: application/json' \
	 -d '{"id":1,"UserId":1, "Products" : [{"id":2,"Quantity":1}]}'
```

#### Low stock

The next order will fail because Jane is trying to purchase 30 Avocados which costs 300, while
Jane's balance is 200.

```shell
curl -X POST localhost:8080/orders/create -H 'Content-Type: application/json' \
	-d '{"id":1,"UserId":2, "Products" : [{"id":1,"Quantity":30}]}'
```

#### Successful purchase

The next order succeeds because John is purchasing 5 Avocados, which costs 50 and
John's balance is 100, which is enough for the purchase.

```shell
curl -X POST localhost:8080/orders/create -H 'Content-Type: application/json' \
	 -d '{"id":1,"UserId":1, "Products" : [{"id":1,"Quantity":5}]}'
```

### Check the balances and stock

Now check that John's balance and Avocado stock is changed accordingly.

```shell
curl localhost:8080/users/read/1
curl localhost:8080/products/read/1
```

## Service code walk-through

The service is using [Gin](https://github.com/gin-gonic/gin) framework for serving REST requests.

In the service's `main` Tigris database is initialized with:

```go
db, err := tigris.OpenDatabase(ctx, &tigris.DatabaseConfig{Config: config.Config{URL: "localhost:8081"}},
		"shop", &User{}, &Product{}, &Order{})
```

When the function succeeds it guaranteed that `shop` database is created or existing one opened.
Collections `User`, `Product`, `Order` are created or their schema updated if the models has changed,
since previous run.

Following lines setup HTTP service routes:

```go
setupCRUDRoutes[User](r, db, "users")
setupCRUDRoutes[Product](r, db, "productss")
```

This sets up `/users/create`, `/users/delete`, `/user/read` routes and the similar for orders.
The function is using Golang generics, so it can be reused to setup CRUD routes for multiple
collections.

The following is part of `setupCRUDRoutes`, which sets `/create` HTTP route:

```go
func setupCRUDRoutes[T interface{}](r *gin.Engine, db *tigris.Database, name string) {
r.POST(fmt.Sprintf("/%s/create", name), func(c *gin.Context) {
		coll := tigris.GetCollection[T](db)

		var u T
		if err := c.Bind(&u); err != nil {
			return
		}

		if _, err := coll.Insert(c, &u); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, u)
	})
...
```

This call instantiates an object of the collection with model T (User or Product) using:

```go
  coll := tigris.GetCollection[T](db)
```

The `coll` object has methods for Inserting, Deleting, Reading documents.

Now, after binding the User or Product object from the request body: `c.Bind(&u);`,
the function is inserting it to Tigris collection `coll.Insert(c, &u)`,
when the call succeeds the object is persisted in the Tigris collection.

### Transactional order create route

For the orders the service sets `read` route and special, transactional `/order/create` route.
See the comments in the code below for details of the create order route:

```go
func setupCreateOrderRoute(r *gin.Engine, db *tigris.Database) {
	r.POST("/orders/create", func(c *gin.Context) {
		var o Order
		// Read the request body into o
		if err := c.Bind(&o); err != nil {
			return
		}

		// Perform the operations with users, products, orders
		// to create the order transactionally
		err := db.Tx(c, func(txCtx context.Context) error {
			// Get an object of the transactional users collection
			users := tigris.GetCollection[User](db)

			// Read the user with order's UserId
			u, err := users.ReadOne(txCtx, filter.Eq("id", o.UserId))
			if err != nil {
				return err
			}

			products := tigris.GetCollection[Product](db)

			orderTotal := 0.0

			// For every product in the order
			for _, v := range o.Products {
				// Read the product with id=v.Id from the Tigris collection
				p, err := products.ReadOne(txCtx, filter.Eq("id", v.Id))
				if err != nil {
					return err
				}

				// Check that this product stock is enough
				if p.Quantity < v.Quantity {
					return fmt.Errorf("low stock on product %v", p.Name)
				}

				// Subtract the quantity required to satisfy the order
				_, err = products.Update(txCtx, filter.Eq("id", v.Id),
					fields.Set("Quantity", p.Quantity-v.Quantity))
				if err != nil {
					return err
				}

				orderTotal += p.Price * float64(v.Quantity)
			}

			if orderTotal > u.Balance {
				return fmt.Errorf("low balance. order total %v", orderTotal)
			}

			// Subtract order total cost from user balance
			_, err = users.Update(txCtx, filter.Eq("id", o.UserId),
				fields.Set("Balance", u.Balance-orderTotal))
			if err != nil {
				return err
			}

			// If no error returned transaction will attempt to commit
			return nil
		})
		// If no error returned here then all the modification transaction made has been
		// successfully persisted in the Trigris collection
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"Status": "PURCHASED"})
	})
}
```

The changes in the above function applied atomically to multiple collections or none of them applied.

## Next steps

- Play with the data using the [CLI](https://docs.tigrisdata.com/cli)
  - `tigris list collections shop`
  - `tigris read shop users`
  - `tigris read shop products`
  - `tigris read shop orders`
- Bring the Tigris Go client into your existing project:
  - `go get github.com/tigrisdata/tigris-client-go@latest`
- Scaffold new Go project:
  - `tigris scaffold go {Company} {Project} {DbName} {CollectionName1} ...`
