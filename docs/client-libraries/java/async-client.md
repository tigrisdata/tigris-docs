# Java: Async Client

In this section we will do code walk through of how to use the async client.

## Client initialization

```java
// configuration
TigrisConfiguration configuration = TigrisConfiguration.newBuilder("server-url").build();

// client
TigrisAsyncClient asyncClient = StandardTigrisAsyncClient.getInstance(configuration);
```

:::info
server-url here is composed of host/ip:port for example: `localhost:8081`

:::

## Create database

```java
CompletableFuture<TigrisAsyncDatabase> completableFuture = asyncClient.
        createDatabaseIfNotExists("my-db");
```

## Retrieve database

```java
TigrisAsyncDatabase asyncDB = asyncClient.getDatabase("my-db");
```

## Create collections

```java
// note: User, Product and Order are of TigrisCollectionType classes and
// these are user defined database collection model classes
CompletableFuture<CreateOrUpdateCollectionsResponse> completableFuture =
        asyncDB.createOrUpdateCollections(User.class, Product.class, Order.class);
```

This will introspect these models and register a collection per class.

## Retrieve collection

```java
TigrisAsyncCollection<User> asyncCollection = asyncDB.getCollection(User.class);
```

## CRUD

```java
// insert 3 users (alice, lucy & emma) into the user collection
User alice = new User(1, "Alice", 100);
User lucy = new User(2, "Lucy", 85);
User emma = new User(3, "Emma", 105);

CompletableFuture<InsertResponse> completableFuture1 = asyncCollection.insert(alice);
CompletableFuture<InsertResponse> completableFuture2 = asyncCollection.insert(lucy);
CompletableFuture<InsertResponse> completableFuture3 = asyncCollection.insert(emma);

// read alice from the user collection.
CompletableFuture<Optional<User>> completableFuture = asyncCollection.readOne(Filters.eq("id", 1));

// update emma's name in the user collection
CompletableFuture<UpdateResponse> completableFuture = asyncCollection.update(
            Filters.eq("id", emma.getId()),
            UpdateFields.newBuilder().set("name", "Dr. Emma").build()
);

// delete lucy from the user collection
CompletableFuture<DeleteResponse> completableFuture = asyncCollection.delete(Filters.eq("id", lucy.getId()));
```

## Perform a transaction

```java
TigrisAsyncDatabase asyncDB = asyncClient.getDatabase(dbName);
asyncDB
    .beginTransaction(new TransactionOptions())
    .whenComplete((session, throwable) -> {
        if (throwable != null) {
            // handle exception
        }
        try{
            // retrieve transaction aware collection
            TransactionTigrisCollection<User> userCollection = session.getCollection(User.class);
            User emma = userCollection.readOne(Filters.eq("id", emma.getId()));
            User lucy = userCollection.readOne(Filters.eq("id", lucy.getId()));

            // reduce emma's balance by 10
            userCollection.update(
                Filters.eq("id", emma.getId()),
                UpdateFields.newBuilder().set(
                   "balance",
                   emma.getBalance() - 10
                ).build()
            );

            // increment lucy's balance by 10
            userCollection.update(
                Filters.eq("id", lucy.getId()),
                UpdateFields.newBuilder().set(
                    "balance",
                    lucy.getBalance() + 10
                ).build()
            );

            // commit transaction
            session.commit();
        } catch(Exception ex) {
            // handle ex
            // in case of an error, rollback
            session.rollback();
        }
    });
```
