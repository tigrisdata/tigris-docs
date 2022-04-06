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
specification with extensions that enable support for richer semantics.

| Type Name | Description                                                                                                                                                         | Supported for Key Fields |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| int       | The int type is used for 32-bit integral numbers.                                                                                                                   | Yes                      |
| bigint    | The bigint type is used for 64-bit integral numbers.                                                                                                                | Yes                      |
| double    | The double type is used for numeric type with floating-point values.                                                                                                | No                       |
| bytes     | The bytes type stores any kind of binary data in an undifferentiated byte stream.                                                                                   | Yes                      |
| string    | The string type is used for strings of text. It may contain Unicode characters.                                                                                     | Yes                      |
| uuid      | The uuid type stores universally unique identifiers (UUIDs). UUIDs are 16-byte numbers used to uniquely identify records.                                           | Yes                      |
| datetime  | The datetime type stores an instant in time expressed as a date that is combined with a time of day with fractional seconds that is based on a 24-hour clock.       | Yes                      |
| boolean   | The boolean type matches only two special values: true and false. Note that values that evaluate to true or false, such as 1 and 0, are not accepted by the schema. | No                       |
| array     | Arrays are used for ordered elements. Each element in an array may be of a different type.                                                                          | No                       |
| object    | Objects are the mapping type. They map “keys” to “values”. The “keys” must always be strings. Each of these pairs is referred to as a “property”.                   | No                       |

### int

The int type is used for 32-bit integral numbers.

```json
{
  "age": {
    "type": "int"
  }
}
```

### bigint

The bigint type is used for 64-bit integral numbers.

```json
{
  "age": {
    "type": "bigint"
  }
}
```

### double

The double type is used for numeric type with floating-point values.

```json
{
  "balance": {
    "type": "double"
  }
}
```

### bytes

The bytes type stores any kind of binary data in an undifferentiated byte
stream.

```json
{
  "data": {
    "type": "bytes"
  }
}
```

### string

The string type is used for strings of text. It may contain Unicode characters.

```json
{
  "name": {
    "type": "string"
  }
}
```

### uuid

The uuid type stores universally unique identifiers (UUIDs). UUIDs are
16-byte numbers used to uniquely identify records.

```json
{
  "cart_id": {
    "type": "uuid"
  }
}
```

### datetime

The datetime type stores an instant in time expressed as a date that is
combined with a time of day with fractional seconds that is based on a
24-hour clock.

```json
{
  "order_date": {
    "type": "datetime"
  }
}
```

### boolean

The boolean type matches only two special values: true and false. Note that
values that evaluate to true or false, such as 1 and 0, are not accepted by
the schema.

```json
{
  "is_active": {
    "type": "boolean"
  }
}
```

### array

Arrays are used for ordered elements. Each element in an array may be of a
different type.

```json
"languages": {
  "description": "Languages spoken by the user",
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

### object

Objects are the mapping type. They map “keys” to “values”. The “keys” must
always be strings. Each of these pairs is referred to as a “property”.

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
      "type": "int"
    }
  }
}
```
