# Quickstart: Java

# Prerequisites

- JDK setup at version 8 / 11 / 17
- Apache maven

The following guide will get you up and running locally as quickly as possible
using the Java.

### Download starter project

```
curl -L  https://github.com/tigrisdata/tigrisdb-starter-java/archive/refs/tags/1.0.0-alpha.1.tar.gz  | tar -xz
```

# Build and generate models

```
cd tigrisdb-starter-java-1.0.0-alpha.1
mvn clean install
```

# Launch

Open it in your favorite IDE and launch the `com.tigrisdata.starter.TigrisDBStarterApplication`
For example using IntelliJ IDEA

![launcher window image](/img/screenshots/launcher_window.png)

A successful launch of the application will end with log line

`[main] INFO c.t.s.spring.TigrisDBInitializer - Finished initializing TigrisDB`

and you can play around with the rest API
at [http://localhost:8080/swagger.html](http://localhost:8080/swagger.html).

# Write HTTP restful endpoint

- Open `com.tigrisdata.starter.controller.OrderController`
- Add a member variable as follows

```java
private final TigrisCollection<Order> orderCollection;
```

- Initialize this member variable in constructor

```java
this.orderCollection = tigrisStarterDatabase.getCollection(Order.class);
```

- Write an endpoint that listens to HTTP `GET` request made at `/order/{id} ` and returns the order object

```java
@GetMapping("/{id}")
public Order read(@PathVariable("id") int id) throws TigrisDBException {
  return orderCollection.readOne(Filters.eq("id", id)).get();
}
```

- Restart the application and your new HTTP endpoint will be ready to serve.

# Understanding what just happened

- tigrisdb-starter-java project contains 3 schemas (`order`, `user` and
  `product`). They are located at `src/main/resources/tigrisdb-schema`
- Maven build configuration invokes tigrisDB model generator maven plugin
  that reads these schema files and generates Java models.
- Existing endpoint demonstrates CRUD operations and a database transaction.
- `com.tigrisdata.starter.spring.TigrisDBInitializer` is responsible for
  creating database and registering collections.
