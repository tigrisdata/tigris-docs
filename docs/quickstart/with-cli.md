# Quickstart: CLI

The following guide will get you up and running locally as quickly as
possible using the CLI.

### 1. Download and run TigrisDB locally via Docker

Open your terminal and use the following command to download the
[docker-compose](https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml)
file and startup TigrisDB. Note that you'll need to have [docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) installed already.

```shell
curl -L -O https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml
docker-compose up -d
```

The docker compose setup will start two containers:

1. A stateless TigrisDB server running on port `8081`.
2. A single-node stateful FoundationDB server running on port `4500`.

Note that this docker compose file is for local development only and should **not** be used in production as the FoundationDB cluster it creates is not run in a highly available or replicated manner.

Next up install the CLI

```shell
go install github.com/tigrisdata/tigrisdb-cli@latest
```

Note that if `tigrisdb-cli` is not available in your shell after that completes, you may need to run `go env` and sure that the values of `GOBIN` (if set) and `GOPATH` are available as part of your `$PATH`. 

If you don't have Go installed on your system, you can download a prebuilt binary [here] and add it to your path like this:

```shell
tar -xf $DIR/$RELEASE.tar.gz && cp $DIR/tigrisdb-cli /usr/local/bin/
```

### 2. Declare your data models

For this quickstart we will model an app that stores information about product, user and order.

Download the sample data model. These files contain TigrisDB schemas for three different collections:

1. products
2. users
3. orders

```shell
mkdir -p productdb/datamodel && cd productdb/datamodel
curl -L \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/products.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/users.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/orders.json
cd ..
```

### 3. Insert and read data

The following example will set up the data model, insert data into the _users_ and
_products_ collections and then read it back.

One of the main features of TigrisDB is the ability to perform strictly serializable
ACID transactions. We will perform a transaction that involves inserting and
updating documents in the _orders_, _users_ and _products_ collections.

Now lets fire up the CLI and use the TigrisDB APIs to perform CRUD operations on
the data.

#### 3.1 Apply the data model

Apply the data model using the CLI and TigrisDB ensures ACID guarantees while applying it in a single transaction.

```shell
tigrisdb-cli create database productdb datamodel/
```

#### 3.2 Insert some data into the user and product collections

```shell
tigrisdb-cli productdb user insert \
'[
    {"id": 1, "name": "Jania McGrory", "balance": "6045.7"},
    {"id": 2, "name": "Bunny Instone", "balance": "2948.87"}
]'

tigrisdb-cli productdb product insert \
'[
    {"id": 1, "name": "Vanilla Beans", "quantity": 6358, "price": 4.39},
    {"id": 2, "name": "Cheese - Provolone", "quantity": 5726, "price": 16.74},
    {"id": 3, "name": "Cake - Box Window 10x10x2.5", "quantity": 5514, "price": 36.4}
]'
```

#### 3.3 Read the data that was inserted

```shell
tigrisdb-cli productdb user read '{"id": 1}'
tigrisdb-cli productdb product read '{"id": 3}'
```

#### 3.4 Perform a transaction that modifies all three collections

```shell
tigrisdb-cli productdb transact \
'[
  {
    "insert": {
      "collection": "order",
      "documents": [{
          "id": 1, "user_id": 1, "order_total": 53.89, "products": [{"id": 1, "quantity": 1}]
        }]
    }
  },
  {
    "update": {
      "collection": "user", "fields": {"$decr": {"balance": 53.89}}, "filter": {"id": 1}
    }
  },
  {
    "update": {
      "collection": "product", "fields": {"$decr": {"quantity": 1}}, "filter": {"id": 1}
    }
  }
]'
```

The transaction we just executed updates three different collections in a single atomic transaction, all while running at an isolation level of strict serialiability! Note that because we're using the CLI the transaction doesn't appear interactive. However, if we were using a real TigrisDB client the transaction would be interactive and we could enforce constraints within our application, like ensuring the user has enough balance or that there is enough available product. See the [Go quick start](with-go.md) section for an example of how we can leverage TigrisDB's transactions to easily and automatically ensure that no customer is ever allowed to purchase goods worth more than their available balance, and that we never create orders that exceed the amount of available product, even if thousands of customers are all trying to purchase the same product at the same time!
