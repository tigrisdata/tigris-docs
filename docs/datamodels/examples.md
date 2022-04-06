# Examples

## Simple e-commerce data model

Below is an example of a data model corresponding to an e-commerce application that stores the data on users, products and orders.

### Example 1.0 - A collection of products

```json
{
  "name": "product",
  "description": "Collection of documents with details of products available",
  "properties": {
    "id": {
      "description": "A unique identifier for the product",
      "type": "bigint"
    },
    "name": {
      "description": "Name of the product",
      "type": "string",
      "max_length": 100
    },
    "quantity": {
      "description": "Number of products available in the store",
      "type": "int"
    },
    "price": {
      "description": "Price of the product",
      "type": "double"
    }
  },
  "primary_key": ["id"]
}
```

### Example 1.1 - A collection of users

```json
{
  "name": "user",
  "description": "Collection of documents with details of users",
  "properties": {
    "id": {
      "description": "A unique identifier for the user",
      "type": "bigint"
    },
    "name": {
      "description": "Name of the user",
      "type": "string",
      "max_length": 100
    },
    "balance": {
      "description": "User account balance",
      "type": "double"
    },
    "languages": {
      "description": "Languages spoken by the user",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "address": {
      "description": "Street address of the user",
      "type": "object",
      "properties": {
        "street": {
          "description": "Street number",
          "type": "string"
        },
        "city": {
          "description": "Name of the city",
          "type": "string"
        },
        "state": {
          "description": "Name of the state",
          "type": "string"
        },
        "zip": {
          "description": "The zip code",
          "type": "int"
        }
      }
    }
  },
  "primary_key": ["id"]
}
```

### Example 1.2 - A collection of orders

```json
{
  "name": "order",
  "description": "Collection of documents with details of an order",
  "properties": {
    "id": {
      "description": "A unique identifier for the order",
      "type": "bigint"
    },
    "user_id": {
      "description": "The identifier of the user that placed the order",
      "type": "bigint"
    },
    "order_total": {
      "description": "The total cost of the order",
      "type": "double"
    },
    "products": {
      "description": "The list of products that are part of this order",
      "type": "array",
      "items": {
        "type": "object",
        "name": "product_item",
        "properties": {
          "id": {
            "description": "The product identifier",
            "type": "bigint"
          },
          "quantity": {
            "description": "The quantity of this product in this order",
            "type": "int"
          }
        }
      }
    }
  },
  "primary_key": ["id"]
}
```
