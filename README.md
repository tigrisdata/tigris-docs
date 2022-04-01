# 🚀 Introduction

## Introduction

[TigrisDB](https://github.com/tigrisdata/tigrisdb) is an open source data platform that makes building modern data-driven apps a breeze. Secure by default, dynamically scalable and zero operational overhead.

TigrisDB is licensed under the terms of the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0).

## Quickstart

The following guide will get you up and running locally as quickly as possible by covering the following 3 steps:

1. Download and run TigrisDB locally via Docker.
2. Declare your data models.
3. Insert and read data.

### 1. Download and run TigrisDB locally via Docker

Open your terminal and use the following command to download the [docker-compose](https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml) file and startup TigrisDB.

```shell
curl -L -O https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml
docker-compose up -d
```

Next up install the CLI

```shell
go install github.com/tigrisdata/tigrisdb-cli@latest
```

### 2. Declare your data models

For this quickstart we will model an app that stores information about products and users.

Download the sample data model

```shell-session
mkdir -p productdb/datamodel && cd productdb/datamodel
curl -L \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/product.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/user.json \
  -O https://raw.githubusercontent.com/tigrisdata/tigrisdb-docs-gitbook/main/sample/productdb/datamodel/order.json
cd ..
```

Apply the data model using the CLI and TigrisDB ensures ACID guarantees while applying it in a single transaction.

```shell-session
tigrisdb-cli create database productdb datamodel/
```

### 3. Insert and read data

Fire up the shell and connect to the database and use the TigrisDB APIs to perform CRUD operations on the data.

Insert some data into the _user_ and _product_ collections

{% tabs %}
{% tab title="CLI" %}
```shell-session
# Insert some data into the user and product collections
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

# Read the data that was inserted
tigrisdb-cli productdb user read '{"id": 1}'
tigrisdb-cli productdb product read '{"id": 3}'

# Perform a transaction between order, product and user collections
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
{% endtab %}

{% tab title="Go" %}

{% endtab %}

{% tab title="Java" %}

{% endtab %}
{% endtabs %}

