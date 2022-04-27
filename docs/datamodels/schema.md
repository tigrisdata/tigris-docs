# Schema

Most applications expect the data they store to conform to some kind of schema.

Tigris enforces that all documents stored in a collection conform to the
collection's schema.

:::tip
We offer schema flexibility by having the ability to evolve the schema in a
very lightweight manner. Documents with different schemas are allowed to
co-exist. Schema changes are instant and do not require a full table rebuild.

:::

## JSON schema

The schema is specified following the JSON schema
[specification](https://json-schema.org/specification.html).

Every schema has three required keywords which are expressed as JSON keys:

- **title**: This keyword states the name of the collection.
- **description**: This keyword states the purpose of the collection.
- **properties**: This keyword states the fields that make up the document
  stored in the collection.

Let's take the example of a collection of user documents. A user document
has the following fields:

- An identifier: `id`
- The name of the user which can have a maximum length of 100 characters: `name`
- The user's account balance: `balance`

Sample schema:

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
    }
  },
  "primary_key": ["id"]
}
```

## Defining the properties

As shown in the schema above there are three fields that make up the user
document. These fields are defined as part of the properties.

The fields must all have the following keywords expressed as JSON keys:

- **type**: This keyword states the data [type](types.md).
- **description**: This keyword describes the purpose of the field

The array and object data types have additional items that must be specified.
This is described in the section below.

### Nested data

This section demonstrates schema with nested data.

#### Array

Data of type array requires the **items** keyword to be expressed as JSON key.
This defines the type of items that will be in the array.

The example below extends the schema for the user collection by adding the
field `languages`

```json
"languages": {
  "description": "Languages spoken by the user",
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

#### Object

Data of type object requires the **properties** keyword to be expressed as JSON
key. This is similar to the top-level **properties** key and specifies the
fields that make up the object.

The example below extends the schema for the user collection by adding the field
`address`

```json
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
```

Below is what the complete schema looks like with the addition of the two new
fields _languages_ and _address_

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
