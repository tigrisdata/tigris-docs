# Java: Async Client

[![Maven Central](https://img.shields.io/maven-central/v/com.tigrisdata/tigris-client-java)](https://mvnrepository.com/artifact/com.tigrisdata/tigris-client)
[![javadoc](https://javadoc.io/badge2/com.tigrisdata/tigris-client/javadoc.svg)](https://javadoc.io/doc/com.tigrisdata/tigris-client)

In this section we will do a code walk through of how to use the Java async
client library to build with the Tigris data platform.

## Client initialization

```java
// configuration
TigrisConfiguration configuration = TigrisConfiguration.newBuilder("localhost:8081").build();

// client
TigrisAsyncClient asyncClient = StandardTigrisAsyncClient.getInstance(configuration);
```

:::info
When starting up Tigris locally, it is available on `localhost:8081` by
default. If you are running it on a different host:port then this would need
to be updated.

:::

## Create database

```java
CompletableFuture<TigrisAsyncDatabase> completableFuture =
        asyncClient.createDatabaseIfNotExists("sampledb");
```

## Retrieve database

```java
TigrisAsyncDatabase db = asyncClient.getDatabase("sampledb");
```

## Create collections

Define the data model for your collections within your application code in
Java and then use the client library to have them created on Tigris.

```java
// collection model definition
public class User implements TigrisCollectionType {
  @TigrisField(description = "A unique identifier for the user")
  @TigrisPrimaryKey(1)
  private int id;

  @TigrisField(description = "Name of the user")
  private String name;

  @TigrisField(description = "User account balance")
  private double balance;

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public double getBalance() {
    return balance;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return id == user.id
        && Double.compare(user.balance, balance) == 0
        && Objects.equals(name, user.name);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, balance);
  }
}

CompletableFuture<CreateOrUpdateCollectionsResponse> completableFuture =
        db.createOrUpdateCollections(User.class);
```

## Retrieve collection

```java
TigrisAsyncCollection<User> userCollection = db.getCollection(User.class);
```

## Insert document

```java
// insert 3 users (alice, lucy & emma) into the user collection
User alice = new User(1, "Alice", 100);
User lucy = new User(2, "Lucy", 85);
User emma = new User(3, "Emma", 105);

CompletableFuture<InsertResponse> completableFuture1 = userCollection.insert(alice);
CompletableFuture<InsertResponse> completableFuture2 = userCollection.insert(lucy);
CompletableFuture<InsertResponse> completableFuture3 = userCollection.insert(emma);
```

## Read document

```java
// read alice from the user collection.
CompletableFuture<Optional<User>> completableFuture = userCollection.readOne(Filters.eq("id", 1));
```

## Update document

```java
// update emma's name in the user collection
CompletableFuture<UpdateResponse> completableFuture = userCollection.update(
            Filters.eq("id", emma.getId()),
            UpdateFields.newBuilder().set("name", "Dr. Emma").build()
);
```

## Delete document

```java
// delete lucy from the user collection
CompletableFuture<DeleteResponse> completableFuture = userCollection.delete(
            Filters.eq("id", lucy.getId())
);
```

## Perform transaction

```java
TigrisAsyncDatabase db = asyncClient.getDatabase(dbName);
db
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
