# Java: Async Client

TigrisDB provides sync and async client. In this section we will do code
walk through of how to use async client.

## Client initialization

```java
// configuration
TigrisDBConfiguration configuration = TigrisDBConfiguration.newBuilder("base-url").build();


// client
TigrisDBAsyncClient asyncClient = StandardTigrisDBAsyncClient.getInstance(
    new TigrisAuthorizationToken(token),
    configuration
);
```

## Create database

```java
CompletableFuture<TigrisDBResponse> dbCreationResponse =
        asyncClient.createDatabaseIfNotExists("my-db");
```

## Retrieve database

```java
CompletableFuture<TigrisDBResponse> dbCreationResponse =
        asyncClient.createDatabaseIfNotExists("my-db");
```

## Create collections

```java
// note: User, Product and Order are of TigrisCollectionType classes
CompletableFuture<ApplySchemasResponse> applySchemasResponseCompletableFuture =
        myDatabase.createOrUpdateCollections(User.class, Product.class, Order.class);
```

This will introspect these models and register collections per class.

## Retrieve collection

```java
TigrisAsyncCollection<User> asyncCollection = asyncDatabase.getCollection(User.class);
```

:::info
Note that `User` is generated model and it automatically implements `com. tigrisdata.db.client.model.TigrisCollectionType`. This was automatically
generated from schema using TigrisDB maven-plugin.
:::

## CRUD

```java
// insert 3 users (alice, lucy & emma) into user collection
User alice = new User().withId(1).withName("Alice").withBalance(100);
User lucy = new User().withId(2).withName("Lucy").withBalance(85);
User emma = new User().withId(3).withName("Emma").withBalance(105);

CompletableFuture<InsertResponse> completableFuture1 = asyncCollection.insert(alice);
CompletableFuture<InsertResponse> completableFuture2 = asyncCollection.insert(lucy);
CompletableFuture<InsertResponse> completableFuture3 = asyncCollection.insert(emma);

// read alice from user collection
CompletableFuture<Optional<User>> completableFuture = asyncCollection.readOne(Filters.eq("id", 1));

// update emma's name in user collection
CompletableFuture<UpdateResponse> completableFuture = asyncCollection.update(
        Filters.eq("id", emma.getId()),
        UpdateFields.newBuilder().set(
            UpdateFields.SetFields.newBuilder().set("name", "Dr. Emma").build()
        ).build()
);

// delete lucy from user collection
CompletableFuture<DeleteResponse> completableFuture = asyncCollection.delete(Filters.eq("id", lucy.getId()));
```

## Perform a transaction

```java
TigrisAsyncDatabase myDatabase = asyncClient.getDatabase(dbName);
myDatabase
    .beginTransaction(transactionOptions)
    .whenComplete((session, throwable) -> {
        if (throwable != null) {
            // handle exception
        }
        try{
            // retrieve transaction aware collection
            TransactionTigrisCollection<User> userCollection = session.getCollection(User.class);
            User emma = userCollection.readOne(Filters.eq("id", emma.getId()));
            User lucy = userCollection.readOne(Filters.eq("id", lucy.getId()));

            // substract emma's balance by 10
            userCollection.update(
                Filters.eq("id", emma.getId()),
                UpdateFields.newBuilder().set(
                    UpdateFields.SetFields
                        .newBuilder()
                        .set(
                            "balance",
                            emma.getBalance() - 10
                         ).build()
                    ).build()
                );

            // add lucy's balance by 10
            userCollection.update(
                Filters.eq("id", lucy.getId()),
                UpdateFields.newBuilder().set(
                    UpdateFields.SetFields
                        .newBuilder()
                        .set(
                            "balance",
                            lucy.getBalance() + 10
                        ).build()
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
