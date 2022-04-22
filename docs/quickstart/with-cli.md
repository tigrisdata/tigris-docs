# Quickstart: CLI

The following guide will get you up and running locally as quickly as
possible using the CLI.

### 1. Startup TigrisDB locally via Docker

The first step is to install the CLI

```shell title=macOS
curl -sSL https://github.com/tigrisdata/tigrisdb-cli/releases/download/v1.0.0-alpha.4/tigris-v1.0.0-alpha.4-darwin-amd64.tar.gz | sudo tar -xz -C /usr/local/bin
```

```shell title=Linux
curl -sSL https://github.com/tigrisdata/tigrisdb-cli/releases/download/v1.0.0-alpha.4/tigris-v1.0.0-alpha.4-linux-amd64.tar.gz | sudo tar -xz -C /usr/local/bin
```

Note that you'll need to have [docker](https://docs.docker.com/get-docker/)
installed already.

Next we start up TigrisDB locally using the _tigris_ cli

```shell
tigris db local up
```

Once this command has completed, TigrisDB server will be available on port
`8081`.

### 2. Declare your data models

For this quickstart we will model a simple ecommerce app. The data would be
stored in three collections _products_, _users_ and _orders_.

Download the sample data model which contains the schema.

```shell
mkdir -p productdb && cd productdb
curl -L \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs/main/sample/productdb/datamodel/products.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs/main/sample/productdb/datamodel/users.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs/main/sample/productdb/datamodel/orders.json
```

### 3. Insert and read data

The following example will set up the data model, insert data into the _users_
and _products_ collections and then read it back.

One of the main features of TigrisDB is the ability to perform ACID
transactions. We will perform a transaction that involves inserting and
updating documents in the _orders_, _users_ and _products_ collections.

Now lets fire up the CLI and use the TigrisDB APIs to perform CRUD operations on
the data.

#### 3.1 Apply the data model

Apply the data model using the CLI and TigrisDB ensures ACID guarantees
while applying it in a transaction.

```shell
tigris db create database productdb
tigris db create collection productdb < products.json
tigris db create collection productdb < users.json
tigris db create collection productdb < orders.json
```

#### 3.2 Insert some data into the user and product collections

```shell
tigris db insert productdb users \
'[
    {"id": 1, "name": "Jania McGrory", "balance": "6045.7"},
    {"id": 2, "name": "Bunny Instone", "balance": "2948.87"}
]'

tigris db insert productdb products \
'[
    {"id": 1, "name": "Vanilla Beans", "quantity": 6358, "price": 4.39},
    {"id": 2, "name": "Cheese - Provolone", "quantity": 5726, "price": 16.74},
    {"id": 3, "name": "Cake - Box Window 10x10x2.5", "quantity": 5514, "price": 36.4}
]'
```

#### 3.3 Read the data that was inserted

```shell
tigris db read productdb users '{"id": 1}'
tigris db read productdb products '{"id": 3}'
```

#### 3.4 Perform a transaction that modifies all three collections

```shell
tigris db transact productdb \
'[
  {
    "insert": {
      "collection": "orders",
      "documents": [{
          "id": 1, "user_id": 1, "order_total": 53.89, "product_item": [{"id": 1, "quantity": 1}]
        }]
    }
  },
  {
    "update": {
      "collection": "users", "fields": {"$decr": {"balance": 53.89}}, "filter": {"id": 1}
    }
  },
  {
    "update": {
      "collection": "products", "fields": {"$decr": {"quantity": 1}}, "filter": {"id": 1}
    }
  }
]'
```

The transaction we just executed updates three different collections in a
single atomic transaction, all while running at an isolation level of strict
serializability.

:::info
Note that because we're using the CLI, the transaction doesn't appear to be
interactive. When using the TigrisDB client library the transaction would be
interactive, and we could enforce constraints within our application. Such as,
ensuring that the user has enough balance or that there is enough available
product.

See the [Go quick start](with-go.md) section for an example of how we can
leverage TigrisDB's transactions to easily and automatically ensure that no
user is ever allowed to purchase products worth more than their available
balance, and that we never create orders that exceed the amount of available
product, even if thousands of users are all trying to purchase the same
product at the same time!

:::
