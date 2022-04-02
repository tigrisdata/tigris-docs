# Schema

The applications that work with the data usually assume some kind of structure. We facilitate this by enforcing schema on the data.&#x20;

We utilize the approach of schema-on-write which ensures that the schema is explicit and the database guarantees schema conformity of the data.

## JSON schema

Schema is specified following the JSON schema [specification](https://json-schema.org/specification.html).

Let's take the example of a collection of user documents. A user document has the following fields:

* An identifier: `id`
* The name of the user which can have a maximum length of 100 characters: `name`
* The user's account balance: `balance`

The schema would then look as follows:

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
    }
  },
  "primary_key": [
    "id"
  ]
}
```

Every schema has three required keywords which are expressed as JSON keys:

* **name**: This keyword states the name of the collection
* **description**: This keyword states the purpose of the collection
* **properties**: This keywords states the fields that make up the document stored in the collection

## Defining the properties

As shown in the schema above there are three fields that make up the user document. These fields are defined as part of the properties.

The fields must all have the following keywords expressed as JSON keys:

* **type**: This keyword states the data type
* **description**: This keywords describes the purpose of the field

Depending on the data type, there are additional keywords that are available.

| Type   | Validator   | Description                       |
| ------ | ----------- | --------------------------------- |
| string | max\_length | Optional. Defines the validation  |
| array  | items       | Required.                         |
| object | properties  | Required.                         |

****

### Nested data

This section demonstrates schema with nested data types. &#x20;

## Schema Flexibility

We offer schema flexibility by having the ability to evolve the schema in a very lightweight manner. Documents with different schemas are allowed to co-exist and schema updates do not require a full table rebuild. Sparseness and support for hierarchical data are other key features.
