# Data Types

There are three categories of data types supported:

- **Primitive**: Strings, Numbers, Binary Data, Booleans, UUIDs, DateTime
- **Complex:** Arrays, Sets
- **Objects**: A container data type defined by the user that stores fields
  of primitive types, complex types as well as other Objects

:::tip
For optimal performance and efficient data layout, there are restrictions on
what data types can be used for primary key fields.

:::

The data types are derived from the types defined in the JSON schema
[specification](https://json-schema.org/specification.html) with extensions
that enable support for richer semantics.

## Type and Format

The `type` and `format` properties in schemas are used to determine the
data type of the field. The `type` property indicates the type of the field.
The `format` property provides additional information about the underlying type.
Fields will always have a `type` property, but some may also have a `format`
property.

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
