# Declaring Models

Models are regular Go structs composed of basic Go types or custom types.
Field properties can be modified using optional "tigris" tag.

```go
type User struct {
    Id          int `tigris:"primaryKey,autoGenerate"`
    FirstName   string
    LastName    string
    Balance     float64
}
```

This declaration will create a collection named `users`.

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
    Id          int `json:"id" tigris:"primaryKey,autoGenerate"`
    FirstName   string
    LastName    string
    Balance     float64
}
```
