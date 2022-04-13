# Java: Client

TigrisDB provides sync and async client. In this section we will do code
walk through of how to use sync client.

## Client initialization

```java
// configuration
TigrtisDBConfiguration tigrisDBConfiguration = TigrisDBConfiguration.
        newBuilder(baseUrl).build();

// client
TigrisDBClient client = StandardTigrisDBClient.getInstance(
                            new TigrisAuthorizationToken(token),
                            tigrisDBConfiguration
                        );
```

## Create database

```java
client.createDatabaseIfNotExists("my-db", DatabaseOptions.DEFAULT_INSTANCE);
```

## Retrieve database

```java
TigrisDatabase myDatabase = client.getDatabase("my-db");
```

## Create collections

```java
myDatabase.createCollectionsInTransaction(new File("src/main/resources/tigrisdb-schema"));
```

This will read all the schema files in this directory and register
collections per schema file.

## Retrieve collection

```java
TigrisCollection<User> userCollection = myDatabase.getCollection(User.class);
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

userCollection.insert(alice);
userCollection.insert(lucy);
userCollection.insert(emma);

// read alice from user collection
User alice = userCollection.readOne(Filters.eq("id", 1)).get();

// update emma's name in user collection
userCollection.update(
        Filters.eq("id", emma.getId()),
        UpdateFields.newBuilder().set(
            UpdateFields.SetFields.newBuilder().set("name", "Dr. Emma").build()
        ).build()
);

// delete lucy from user collection
userCollection.delete(Filters.eq("id", lucy.getId()));
```

## Perform a transaction

```java
TigrisDatabase myDatabase = client.getDatabase(dbName);
TransactionOption transactionOptions = new TransactionOption();
TransactionSession session = myDatabase.beginTransaction(transactionOptions);
try {
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
```
