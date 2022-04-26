# Java: Client

In this section we will do code walk through of how to use the sync client.

## Client initialization

```java
// configuration
TigrisConfiguration configuration = TigrisConfiguration.newBuilder("server-url").build();

// client
TigrisClient client = StandardTigrisClient.getInstance
        (tigrisConfiguration);
```

:::info
server-url here is composed of host/ip:port for example: `localhost:8081`

:::

## Create database

```java
TigrisDatabase myDatabase = client.createDatabaseIfNotExists("sampledb");
```

## Retrieve database

```java
TigrisDatabase myDatabase = client.getDatabase("sampledb");
```

## Create collections

```java
// note: User, Product and Order are of TigrisCollectionType classes and
// these are user defined database collection model classes

myDatabase.createOrUpdateCollections(User.class, Product.class, Order.class);
```

This will introspect these models and register a collection per class.

## Retrieve collection

```java
TigrisCollection<User> userCollection = myDatabase.getCollection(User.class);
```

## CRUD

```java
// insert 3 users (alice, lucy & emma) into the user collection
User alice = new User(1, "Alice", 100);
User lucy = new User(2, "Lucy", 85);
User emma = new User(3, "Emma", 105);

userCollection.insert(alice);
userCollection.insert(lucy);
userCollection.insert(emma);

// read alice from the user collection
User alice = userCollection.readOne(Filters.eq("id", 1)).get();

// update emma's name in the user collection
userCollection.update(
            Filters.eq("id", emma.getId()),
            UpdateFields.newBuilder().set("name", "Dr. Emma").build()
);

// delete lucy from the user collection
userCollection.delete(Filters.eq("id", lucy.getId()));
```

## Perform a transaction

```java
TigrisDatabase myDatabase = client.getDatabase(dbName);
TransactionSession session = myDatabase.beginTransaction(new TransactionOptions());
try {
    // retrieve transaction aware collection
    TransactionTigrisCollection<User> userCollection = session.getCollection(User.class);
    User emma = userCollection.readOne(Filters.eq("id", emma.getId()));
    User lucy = userCollection.readOne(Filters.eq("id", lucy.getId()));

    // reduce emma's balance by 10
    userCollection.update(
        Filters.eq("id", emma.getId()),
        UpdateFields.newBuilder()
        .set(
             "balance",
             emma.getBalance() - 10
        ).build()
    );

    // increment lucy's balance by 10
    userCollection.update(
        Filters.eq("id", lucy.getId()),
        UpdateFields.newBuilder()
        .set(
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
```
