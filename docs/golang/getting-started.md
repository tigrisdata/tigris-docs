# Getting Started

[![Go Reference](https://pkg.go.dev/badge/github.com/tigrisdata/tigris-client-go.svg)](https://pkg.go.dev/github.com/tigrisdata/tigris-client-go)

## Prerequisites

The Tigris client depends on
[Golang generics](https://go.dev/doc/tutorial/generics) which requires Go 1.18
or newer.

## Installation

```shell
go get -u github.com/tigrisdata/tigris-client-go@latest
```

## Connecting to the database

### Set up the data model

Models are regular Go structs composed of basic Go types or custom types.

```go
type User struct {
    Id      int `tigris:"primary_key,autoGenerate"`
    Name    string
    Balance float64
}
```

This declaration will create a collection named `users`.

For detailed documentation on data modeling refer to the
[data modeling](datamodel) section.

### Connect and initialize the database

The `OpenDatabase` function connects to the Tigris backend, creates the
database and collections if they don't exist, otherwise updates the schema of
the collections if they already exist.

```go
db, err := tigris.OpenDatabase(ctx,
	&config.Database{Driver: config.Driver{URL: "localhost:8081"}},
    "hello_db", &User{})
```
