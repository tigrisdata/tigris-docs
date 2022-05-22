# Client Library: Go

[![Go Reference](https://pkg.go.dev/badge/github.com/tigrisdata/tigris-client-go.svg)](https://pkg.go.dev/github.com/tigrisdata/tigris-client-go)

This library provides and interface to access Tigris platform from Golang programs.

## Requirements

The Tigris library depends on [Golang generics](https://go.dev/doc/tutorial/generics), so Go 1.18 or newer is required.

## Installation

Run this to bring Tigris library as a dependency to your project:

```shell
go get github.com/tigrisdata/tigris-client-go@latest
```

## Data modelling

Collections models are defined declaratively in the code. Here is an example
of the collection with one string, one integer and one double fields:

```go
type User struct {
    Id int64 `tigris:"primary_key"`
    Name string
	Balance float64
}
```

Please note `tigris"primary_key"` annotation, which indicates the fields which is
used as primary key of the collection.

## Initialization

The `OpenDatabase` connects to the Tigris instance and initialize collections
using provided configuration and collections models:

```go
	cfg := &config.Database{
	    Driver: config.Driver{
			URL: "localhost:8081"
		}}

	db, err := tigris.OpenDatabase(ctx, cfg, "OrderDB", &User{})
```

Once `OpenDatabase` succeeds the database `OrderDB` and
collection for `User` are initialized.

## Accessing the documents in the collection

To access the documents a collection object should be instantiated,
using collection model type and database object returned by `OpenDatabase`:

```go
	users := tigris.GetCollection[User](db)
```

Returned `users` object has methods to read and modify documents.

### Insert documents

Use `Insert` API to insert documents into collection.
The following example inserts two documents into the `users` collection:

```go
    _, err = users.Insert(ctx,
		&User{Id: 1, Name: "Jane", Balance: 100},
        &User{Id: 2, Name: "John", Balance: 100}
	)
    if err != nil {
		//handle error
    }
```

Insert API will fail if a document with same `Id` already exists in the collection,
meaning that insert API maintains uniqueness of the field which marked as primary key.

### Read documents

Read returns the documents which matches the provided filter.
In the following example two documents with `Id=1` and `Id=2` returned,
so the filter is equivalent to `Id=1 or Id=2` logical condition.

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

There are two other forms of read API, which provide simplified interface for
read one and read all documents from the collection.

#### Read one document

```go
    var u *User
    u, err := users.ReadOne(ctx, filter.Eq("Id", 1))
    if err != nil {
        // handle error
    }
```

#### Read all documents

```go
    var u User
    it, err := users.ReadAll(ctx)
    if err != nil {
        // handle error
    }
	// iterate documents here
```

### Update documents

Update API is used to partially update existing documents.
It updates the fields of the documents, which matches the filter.
Update mutation specifies which fields need to be modified.

In the following example the field `Balance` of the `User` with `Id`=1
is set to 200:

```go
	_, err = users.Update(ctx, filter.Eq("Id", "1"), fields.Set("Balance", 200))
	if err != nil {
		// handle error
	}
```

### Delete documents

Delete API allows to delete documents which matches provided filter:

```go
    if _, err := users.Delete(ctx, filter.Eq("Id", "1")); err != nil {
		// handle errors
	}
```

#### Delete all documents

This is a simplified version of delete API to remove all the documents
in the collection:

```go
    if _, err := users.DeleteAll(ctx); err != nil {
        // handle errors
    }
```

## Transactions

The Tigris platform provides transactional interface, which can be used to
consistently modify documents across collections.

```go
	// When the closure returns no error, the changes from all operations
	// executed in it will be applied to the database.
	// Changes will be discarded when the closure returns an error.
	// In this example if Balance is lower than 100 transaction will be rolled back
	err = db.Tx(ctx, func(txCtx context.Context) error {
		// Get the transactional collection object
		c := tigris.GetCollection[User](db)

		u, err := c.ReadOne(txCtx, filter.Eq("Id", 1))
		if err != nil {
			return err
		}

		if u.Balance < 100 {
			return fmt.Errorf("low balance")
		}

		// ...
		// Same API as in non-transactional case can be used here
		return nil
	})
	if err != nil {
		panic(err)
	}
}
```

## Next steps

- Play with complete example [service](https://github.com/tigrisdata/tigris-starter-go)
- Check the full API [reference](https://pkg.go.dev/github.com/tigrisdata/tigris-client-go)
