# JSON Specification

Tigris follows the JSON schema
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

## Data types

The data types are derived from the types defined in the JSON schema
[specification](https://json-schema.org/specification.html).

The `type` and `format` properties in schemas are used to determine the
data type of the field. The `type` property indicates the type of the field.
The `format` property provides additional information about the underlying type.
Fields will always have a `type` property, but some may also have a `format`
property. The JSON schema
[specification](https://json-schema.org/specification.html) already defines
a set of common formats. We support these formats and define others as well.

For optimal performance and efficient data layout, we also impose some
restrictions on what data types can be used for primary key fields.

The full list of supported `type` and `format` are listed below.

:::tip
Note that the [client libraries](/category/client-libraries) that we provide
use language-idiomatic types for the types and formats below. For example,
while a 64-bit integer is represented as type _integer_ in JSON requests and
responses, but our Java client library uses the Java _long_ type.

:::

| Type    | Format    | Description                                                                                                                      | Supported for Key Fields |
| ------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| integer |           | A 64-bit integral number. Optionally, format can be specified as `int64`.                                                        | Yes                      |
| integer | int32     | A 32-bit integral number.                                                                                                        | Yes                      |
| number  |           | A double-precision 64-bit IEEE 754 floating point. Optionally, format can be specified as `double`.                              | No                       |
| number  | float     | A single-precision 32-bit IEEE 754 floating point.                                                                               | No                       |
| string  |           | An arbitrary string. It may contain Unicode characters.                                                                          | Yes                      |
| string  | byte      | Binary data in an undifferentiated byte stream.                                                                                  | Yes                      |
| string  | uuid      | Universally unique identifiers (UUIDs). UUIDs are 16-byte numbers used to uniquely identify records.                             | Yes                      |
| string  | date-time | An RFC3339 timestamp in UTC time. This in the format of yyyy-MM-ddTHH:mm:ss.SSSZ. The milliseconds portion (".SSS") is optional. | Yes                      |
| boolean |           | A boolean value, either "true" or "false".                                                                                       | No                       |
| array   |           | An array of values. The items property indicates the schema for the array values.                                                | No                       |
| object  |           | A container type that stores other fields. The properties key defines the schema for the object.                                 | No                       |

### int64

Representing 64-bit integral numbers.

```json
{
  "age": {
    "type": "integer"
  }
}
```

### int32

Representing 32-bit integral numbers.

```json
{
  "age": {
    "type": "integer",
    "format": "int32"
  }
}
```

### double

Representing double-precision 64-bit IEEE 754 floating point values.

```json
{
  "balance": {
    "type": "number"
  }
}
```

### float

Representing single-precision 32-bit IEEE 754 floating point values.

```json
{
  "balance": {
    "type": "number",
    "format": "float"
  }
}
```

### byte

Representing binary data in an undifferentiated byte stream.

```json
{
  "data": {
    "type": "string",
    "format": "byte"
  }
}
```

### string

Representing strings of text that may contain Unicode characters.

```json
{
  "name": {
    "type": "string"
  }
}
```

### uuid

Representing universally unique identifiers (UUIDs). UUIDs are 16-byte
numbers used to uniquely identify records.

```json
{
  "cart_id": {
    "type": "string",
    "format": "uuid"
  }
}
```

### date-time

Representing an RFC3339 timestamp in UTC time.

```json
{
  "order_date": {
    "type": "string",
    "format": "date-time"
  }
}
```

### boolean

Representing a boolean value, either "true" or "false".

```json
{
  "is_active": {
    "type": "boolean"
  }
}
```

### array

Representing an array of values. The `items` property indicates the data type
for the array values.

```json
{
  "languages": {
    "description": "Languages spoken by the user",
    "type": "array",
    "items": {
      "type": "string"
    }
  }
}
```

### object

Representing a container type that stores other fields. The `properties` key
defines the schema for the object.

```json
{
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
}
```

## Nested data

This section demonstrates schema with nested data.

### Array

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

### Object

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
