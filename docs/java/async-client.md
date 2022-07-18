# Async Client

[![Maven Central](https://img.shields.io/maven-central/v/com.tigrisdata/tigris-client-java)](https://mvnrepository.com/artifact/com.tigrisdata/tigris-client)
[![javadoc](https://javadoc.io/badge2/com.tigrisdata/tigris-client/javadoc.svg)](https://javadoc.io/doc/com.tigrisdata/tigris-client)

In this section we will do a code walk through of how to use the Java async
client library to build with Tigris.

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
  @TigrisPrimaryKey(order = 1, autoGenerate = true)
  private int id;

  private String firstName;
  private String lastName;
  private double balance;

  public User() {}

  public int getId() {
    return id;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public double getBalance() {
    return balance;
  }

  public void setId(int id) {
    this.id = id;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;

    if (id != user.id) return false;
    if (Double.compare(user.balance, balance) != 0) return false;
    if (!Objects.equals(firstName, user.firstName)) return false;
    return Objects.equals(lastName, user.lastName);
  }

  @Override
  public int hashCode() {
    int result;
    long temp;
    result = id;
    result = 31 * result + (firstName != null ? firstName.hashCode() : 0);
    result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
    temp = Double.doubleToLongBits(balance);
    result = 31 * result + (int) (temp ^ (temp >>> 32));
    return result;
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
User alice = new User("Alice", 100);
User lucy = new User("Lucy", 85);
User emma = new User("Emma", 105);

CompletableFuture<InsertResponse> completableFuture1 = userCollection.insert(alice);
CompletableFuture<InsertResponse> completableFuture2 = userCollection.insert(lucy);
CompletableFuture<InsertResponse> completableFuture3 = userCollection.insert(emma);
```

## Read document

```java
// read alice from the user collection.
CompletableFuture<Optional<User>> completableFuture = userCollection.readOne
        (Filters.eq("id", alice.getId()));
```

## Search documents

To search for documents, use the `search()` API. Search consists of a query against text fields in a collection.

```java
SearchRequest request = SearchRequest.newBuilder("Jania").build();
userCollection.search(request, new TigrisAsyncSearchReader<User>() {
        @Override
        public void onNext(SearchResult<User> result) {
            // Receive a search result from stream
        }

        @Override
        public void onError(Throwable t) {
            // Handle error
        }

        @Override
        public void onCompleted() {
            // Operation completed
        }
    });
```

### Project search query against specific fields

By default, query is projected against all the text fields in collection. To project query against specific fields:

```java
SearchRequest request = SearchRequest.newBuilder("Jania")
                          .withSearchFields("firstName", "lastName")
                          .build()
```

### Refine the search results

[Filters](../overview/filter.md) can be applied to further refine the search results.

```java
SearchRequest request = SearchRequest.newBuilder("Jania")
                          .withSearchFields("firstName", "lastName")
                          .withFilter(Filters.eq("balance", 2000))
                          .build()
```

### Facet the search results

Optionally, facet query can be specified to retrieve aggregate count of values for one or more fields.

```java
SearchRequest request = SearchRequest.newBuilder("Jania")
                          .withSearchFields("firstName")
                          .withFilter(Filters.eq("balance", 2000))
                          .withFacetFields("lastName")
                          .build()
```

## Update document

```java
// update emma's name in the user collection
CompletableFuture<UpdateResponse> completableFuture = userCollection.update(
            Filters.eq("id", emma.getId()),
            UpdateFields.newBuilder().set("firstName", "Dr. Emma").build()
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

## Drop database

```java
asyncClient.dropDatabase("sampledb");
```
