# Working Locally

Getting started working with Tigris locally requires one easy step.

## Starting up Tigris on your local machine

Open your terminal, and:

```shell
tigris local up
```

This will spin up Tigris locally via Docker. The Tigris
server will then be available on port `8081`.

### Health Check

You can use the `ping` command to verify that the server is ready to
accept requests.

```shell
tigris ping
```

## Start building

That's it, you are ready to build with Tigris!

### Create sample schema

For this quickstart we will model a simple ecommerce app. The data would be
stored in three collections _products_, _users_ and _orders_.

Let's use the CLI to generate the sample schema and create the three
collections in the database named _sampledb_.

```shell
tigris generate sample-schema --create
```

The schema of the collections created can be fetched as follows

```shell
tigris describe collection sampledb orders
```

### Insert data

The following example will insert data into the _users_ and _products_
collections and then read it back.

One of the main features of Tigris is the ability to perform ACID
transactions. We will perform a transaction that involves inserting and
updating documents in the _orders_, _users_ and _products_ collections.

Now lets fire up the CLI and use the Tigris APIs to perform CRUD operations on
the data.

#### Insert some data into the user and product collections

```shell
tigris insert sampledb users \
'[
    {"id": 1, "name": "Jania McGrory", "balance": 6045.7},
    {"id": 2, "name": "Bunny Instone", "balance": 2948.87}
]'
```

```shell
tigris insert sampledb products \
'[
    {"id": 1, "name": "Vanilla Beans", "quantity": 6358, "price": 4.39},
    {"id": 2, "name": "Cheese - Provolone", "quantity": 5726, "price": 16.74},
    {"id": 3, "name": "Cake - Box Window 10x10x2.5", "quantity": 5514, "price": 36.4}
]'
```

### Read the data that was inserted by the Primary key field

```shell
tigris read sampledb users '{"id": 1}'
```

```shell
tigris read sampledb products '{"id": 3}'
```

### Read the data that was inserted by any field in the schema

```shell
tigris read sampledb users '{"name": "Jania McGrory"}'
```

```shell
tigris read sampledb products '{"name": "Vanilla Beans"}'
```

### Perform a transaction that modifies all three collections

```shell
tigris transact sampledb \
'[
  {
    "insert": {
      "collection": "orders",
      "documents": [{
          "id": 1, "user_id": 1, "order_total": 53.89, "products": [{"id": 1, "quantity": 1}]
        }]
    }
  },
  {
    "update": {
      "collection": "users", "fields": {"$set": {"balance": 5991.81}}, "filter": {"id": 1}
    }
  },
  {
    "update": {
      "collection": "products", "fields": {"$set": {"quantity": 6357}}, "filter": {"id": 1}
    }
  }
]'
```

## Shutting down the local Tigris

Shutting down the locally running Tigris is also as easy as requiring a
single step. Open your terminal, and:

```shell
tigris local down
```

## Customizing the Tigris server version and port

You can change the Tigris server port. For example, if you want
the server to be available on port `9091`:

```shell
tigris local up 9091
```
