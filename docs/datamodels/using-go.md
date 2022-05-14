# Using Go

Tigris enables the data models to be declared as part of the
application code. These data models are then converted to appropriate
objects, such as collections, on the backend.

In this section we will cover data modeling using Go.

## Declaring Models

Models are regular Go structs composed of basic Go types or custom types.

```go
type User struct {
    Id      int `tigris:"primary_key"`
    Name    string
    Balance float64
}
```

This declaration will create a collection named `users` with the following
schema on Tigris

```json
{
  "title": "users",
  "properties": {
    "Balance": {
      "type": "number"
    },
    "Id": {
      "type": "integer"
    },
    "Name": {
      "type": "string"
    }
  },
  "primary_key": ["Id"]
}
```

### Collection Names

The name of the collection is derived from the struct name. The struct
name is pluralized to snake_cases as collection name. For example, the
struct name `User` is converted to `users` as the collection name. While
the struct name `UserDetail` is converted to `user_details` as the
collection name.

### Field Names

The name of the fields in the struct are used as the field names in the
collection's schema. There is no conversion performed by default. To have
fields in the collection schema with a different name, you can configure
**json** field tags as can be seen below

```go
type User struct {
    Id      int `json:"id" tigris:"primary_key"`
    Name    string
    Balance float64
}
```

### Defining Primary Key

Every collection must have a primary key. One or more fields in the struct
can be specified as primary key by configuring **tigris primary key** field
tag. The example below demonstrates a model with a single primary key field

```go
type UserDetail struct {
	Id    int `tigris:"primary_key"`
	Email string
	Age   int
}
```

Composite primary keys are also supported but in case of composite keys
order of the fields is important. The example below demonstrates
how the order of the fields are defined in case of a composite primary key

```go
type UserDetail struct {
	Id    int    `tigris:"primary_key:1"`
	Email string `tigris:"primary_key:2"`
	Age   int
}
```

The model definition above will result in the following collection schema

```json
{
  "title": "user_details",
  "properties": {
    "Id": {
      "type": "integer"
    },
    "Email": {
      "type": "string"
    },
    "Age": {
      "type": "integer"
    }
  },
  "primary_key": ["Id", "Email"]
}
```

### Embedded Data Model

Tigris offers rich documents that enable embedding related data in a single
document. Embedded models allow applications to complete database operations
with fewer queries or updates, thus reducing query activity and increasing
efficiency.

Below is an example of embedded data model. We first define the `Product`
type and then embed it inside the `Order` type.

```go
type Product struct {
	Id       int `tigris:"primary_key"`
	Name     string
	Quantity int
	Price    float64
}

type Order struct {
	Id     int `tigris:"primary_key"`
	UserId int

	Products []Product
}
```

The model definition above will result in the following collection schema

```json
{
  "title": "orders",
  "properties": {
    "Id": {
      "type": "integer"
    },
    "UserId": {
      "type": "integer"
    },
    "Products": {
      "items": {
        "properties": {
          "Id": {
            "type": "integer"
          },
          "Name": {
            "type": "string"
          },
          "Price": {
            "type": "number"
          },
          "Quantity": {
            "type": "integer"
          }
        },
        "type": "object"
      },
      "type": "array"
    }
  },
  "primary_key": ["Id"]
}
```

### Supported Go Types

Tigris supports the majority of the basic Go types while also providing support
for custom types.

- Basic types: int, int64, string, flot64
- Custom types: struct to define custom types

### Field Tags

Tags can be used in the struct definition to enrich the fields when
declaring the models.

| Tag Name             | Description                                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| json                 | Customize the struct fields when the model is converted into collection schema. Primarily used for transforming the struct field names as they get converted to collection schema |
| tigris:"primary_key" | Specify the field that will be used as the primary key. Optionally specify a number, for example `tigris:"primary_key:1"`, to define the field order in a composite primary key   |
