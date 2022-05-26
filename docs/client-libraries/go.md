# Client Library: Go

[![Go Reference](https://pkg.go.dev/badge/github.com/tigrisdata/tigris-client-go.svg)](https://pkg.go.dev/github.com/tigrisdata/tigris-client-go)

Tigris provides an easy-to-use and intuitive interface for Go. Setting up
the database is instantaneous, as well - no need for tedious configuration.
You define the data model as part of the application code, which then drives
the database infrastructure without you having to configure and provision
database resources.

## Prerequisites

The Tigris client depends on
[Golang generics](https://go.dev/doc/tutorial/generics) which requires Go 1.18
or newer.

## Installation

```shell
go get -u github.com/tigrisdata/tigris-client-go@latest
```

## Set up the data model

Models are regular Go structs composed of basic Go types or custom types.

```go
type User struct {
    Id      int `tigris:"primary_key"`
    Name    string
    Balance float64
}
```

This declaration will create a collection named `users`.

For detailed documentation on data modeling refer to the
[data modeling using go](../datamodels/using-go.md) section.

## Connect and initialize the database

The `OpenDatabase` function connects to the Tigris backend, creates the
database and collections if they don't exist, otherwise updates the schema of
the collections if they already exist.

```go
db, err := tigris.OpenDatabase(ctx,
	&config.Database{Driver: config.Driver{URL: "localhost:8081"}},
    "hello_db", &User{})
```

## CRUD operations

The first step is to set up the collection object. All the CRUD operations
on the collection are performed through this collection object.

```go
users := tigris.GetCollection[User](db)
```

### Insert documents

Use the `Insert` API to insert one or more documents into collection.

```go
_, err := users.Insert(ctx,
    &User{Id: 1, Name: "Jania McGrory", Balance: 6045.7},
    &User{Id: 2, Name: "Bunny Instone", Balance: 2948.87})
if err != nil {
    // handle error
}
```

The Insert API maintains uniqueness of the field marked as the primary key,
for example, the field `Id` in the example above. If a document with the
same primary key value already exists in the collection, the Insert fails.

### Upsert documents

Use the `InsertOrReplace` API to insert a new document or replace an existing
document with the same primary key value.

```go
_, err := users.InsertOrReplace(ctx,
    &User{Id: 1, Name: "Jania McGrory", Balance: 6045.7},
    &User{Id: 2, Name: "Bunny Instone", Balance: 2948.87})
if err != nil {
    // handle error
}
```

### Read documents

To read one or more documents, use the `Read` API. If filters are provided,
then documents matching the filtering condition are fetched.

```go
it, err := users.Read(ctx,
    filter.Or(
        filter.Eq("Id", 1),
        filter.Eq("Id", 2)
    ))
if err != nil {
    // handle error
}
defer it.Close()

var user User
for it.Next(&user) {
    fmt.Printf("%+v\n", user)
}

if it.Err() != nil {
    // handle error
}
```

#### Read single document

To read a single document, use the `ReadOne` API.

```go
var user *User
user, err = users.ReadOne(ctx, filter.Eq("Id", 1)) // find user with Id 1
if err != nil {
    panic(err)
}
```

#### Read all documents

Use the `ReadAll` API to read all the documents in the collection.

```go
var u User
it, err := users.ReadAll(ctx)
if err != nil {
    // handle error
}

defer it.Close()

var user User
for it.Next(&user) {
    fmt.Printf("%+v\n", user)
}

if it.Err() != nil {
    // handle error
}
```

### Update documents

The Update API is used to update existing documents that match the filters.
Fields that need to be updated are specified when calling the API.

In the following example, the field `Balance` is updated for documents which
match the filter `Id=1`.

```go
_, err := users.Update(ctx, filter.Eq("Id", "1"), fields.Set("Balance", 200))
if err != nil {
    // handle error
}
```

### Delete documents

Use the `Delete` API to delete documents that match the filters.

```go
_, err := users.Delete(ctx, filter.Eq("Id", "1"))
if err != nil {
    // handle error
}
```

#### Delete all documents

In order to truncate the collection and delete all the documents in it, use
the `DeleteAll` API.

```go
_, err := users.DeleteAll(ctx)
if err != nil {
    // handle error
}
```

## Transactions

Tigris provides global, ACID transactions with strict serializability
using optimistic concurrency control. The transactions allow multiple
clients to concurrently read and write data in the database with strong
consistency guarantees.

Transactions in Tigris work across collections and documents without any
restrictions. Unlike some other document databases, there are no confusing
read / write concerns to configure, and no cross-shard caveats.

```go
// When the closure returns no error, the changes from all the operations
// executed in it will be committed as a transaction.
// If the closure returns an error, the changes from the operations are
// rolled back.
db.Tx(ctx, func(txCtx context.Context) error {
    var userOne *User
    if userOne, err = users.ReadOne(txCtx, filter.Eq("Id", 1)); err != nil {
        return err
    }

    var userTwo *User
    if userTwo, err = users.ReadOne(txCtx, filter.Eq("Id", 2)); err != nil {
        return err
    }

    if _, err = users.Update(txCtx, filter.Eq("Id", 1),
        fields.Set("Balance", userOne.Balance-100)); err != nil {
        return err
    }
    if _, err = users.Update(txCtx, filter.Eq("Id", 2),
        fields.Set("Balance", userTwo.Balance+100)); err != nil {
        return err
    }

    return nil
})
```
