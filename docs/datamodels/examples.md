# Examples

## Simple e-commerce data model

Below is an example of a simple data model corresponding to an e-commerce
application that stores data in three different collections: _users_,
_products_, and _orders_.

### Example 1.0 - A collection of products

```json
{
  "title": "products",
  "description": "Collection of documents with details of products available",
  "properties": {
    "id": {
      "description": "A unique identifier for the product",
      "type": "integer"
    },
    "name": {
      "description": "Name of the product",
      "type": "string",
      "maxLength": 100
    },
    "quantity": {
      "description": "Number of products available in the store",
      "type": "integer"
    },
    "price": {
      "description": "Price of the product",
      "type": "number"
    }
  },
  "primary_key": ["id"]
}
```

### Example 1.1 - A collection of users

```json
{
  "title": "users",
  "description": "Collection of documents with details of users",
  "properties": {
    "id": {
      "description": "A unique identifier for the user",
      "type": "integer"
    },
    "name": {
      "description": "Name of the user",
      "type": "string",
      "maxLength": 100
    },
    "balance": {
      "description": "User account balance",
      "type": "number"
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
          "type": "integer"
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
  "title": "orders",
  "description": "Collection of documents with details of an order",
  "properties": {
    "id": {
      "description": "A unique identifier for the order",
      "type": "integer"
    },
    "user_id": {
      "description": "The identifier of the user that placed the order",
      "type": "integer"
    },
    "order_total": {
      "description": "The total cost of the order",
      "type": "number"
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
            "type": "integer"
          },
          "quantity": {
            "description": "The quantity of this product in this order",
            "type": "integer"
          }
        }
      }
    }
  },
  "primary_key": ["id"]
}
```
