# Sync Client

[![Maven Central](https://img.shields.io/maven-central/v/com.tigrisdata/tigris-client-java)](https://mvnrepository.com/artifact/com.tigrisdata/tigris-client)
[![javadoc](https://javadoc.io/badge2/com.tigrisdata/tigris-client/javadoc.svg)](https://javadoc.io/doc/com.tigrisdata/tigris-client)

In this section we will do a code walk through of how to use the Java sync
client library to build with Tigris.

## Client initialization

```java
// configuration
TigrisConfiguration configuration = TigrisConfiguration.newBuilder("localhost:8081").build();

// client
TigrisClient client = StandardTigrisClient.getInstance(tigrisConfiguration);
```

:::info
When starting up Tigris locally, it is available on `localhost:8081` by
default. If you are running it on a different host:port then this would need
to be updated.

:::

## Create database

```java
TigrisDatabase db = client.createDatabaseIfNotExists("sampledb");
```

## Retrieve database

```java
TigrisDatabase db = client.getDatabase("sampledb");
```

## Create collection

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

// create the collection(s)
db.createOrUpdateCollections(User.class);
```

## Retrieve collection

```java
TigrisCollection<User> userCollection = db.getCollection(User.class);
```

## Insert document

```java
// insert 3 users (alice, lucy & emma) into the user collection
User alice = new User("Alice", 100);
User lucy = new User("Lucy", 85);
User emma = new User("Emma", 105);

userCollection.insert(alice);
userCollection.insert(lucy);
userCollection.insert(emma);
```

## Read document

```java
// read alice from the user collection
User alice = userCollection.readOne(Filters.eq("id", alice.getId())).get();
```

## Search documents

To search for documents, use the `search()` API. Search consists of a query against text fields in a collection.

```java
SearchRequest request = SearchRequest.newBuilder("Jania").build();
Iterator<SearchResult<User>> results = userCollection.search(request);
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
userCollection.update(
            Filters.eq("id", emma.getId()),
            UpdateFields.newBuilder().set("firstName", "Dr. Emma").build()
);
```

## Delete document

```java
// delete lucy from the user collection
userCollection.delete(Filters.eq("id", lucy.getId()));
```

## Perform transaction

```java
TigrisDatabase db = client.getDatabase(dbName);
db.transact(
        tx -> {
                try {
                    // retrieve transaction aware collection
                    TigrisCollection<User> userCollection = db.getCollection(User.class);
                    User emma = userCollection.readOne(Filters.eq("id", emma.getId()));
                    User lucy = userCollection.readOne(Filters.eq("id", lucy.getId()));

                    // reduce emma's balance by 10
                    userCollection.update(
                    Filters.eq("id", emma.getId()),
                    UpdateFields.newBuilder().set("balance", emma.getBalance() - 10).build());

                    // increment lucy's balance by 10
                    userCollection.update(
                    Filters.eq("id", lucy.getId()),
                    UpdateFields.newBuilder().set("balance", lucy.getBalance() + 10).build());
            } catch (Exception ex) {
                    // throw it to rollback ongoing transaction
                    throw new IllegalStateException(ex);
            }
        });
```

## Drop database

```java
client.dropDatabase("sampledb");
```
