# Quickstart: Java

The following guide will get you up and running locally as quickly as possible
using Java.

### 1. Download and run TigrisDB locally via Docker

Open your terminal and use the following command to download the
[docker-compose](https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml)
file and startup TigrisDB. Note that you'll need to have
[docker](https://docs.docker.com/get-docker/) and
[docker compose](https://docs.docker.com/compose/install/) installed already.

```shell
curl -L -O https://raw.githubusercontent.com/tigrisdata/tigrisdb/main/docker/local/docker-compose.yaml
docker-compose up -d
```

The docker compose setup will start two containers:

1. A stateless TigrisDB server running on port `8081`.
2. A single-node stateful FoundationDB server running on port `4500`.

Note that this docker-compose file is for local development only and should
**not** be used in production as the FoundationDB cluster it creates does
not run in a highly available or replicated manner.

### 2. Download the starter project

Open your terminal and use the following command to download the started project

```shell
curl -L https://github.com/tigrisdata/tigrisdb-starter-java/archive/refs/tags/1.0.0-alpha.3.tar.gz  | tar -xz
```

### 3. Build the project and generate the models

The following prerequisites are needed for this step:

- JDK setup at version 8 / 11 / 17
- Apache maven

From your terminal move into the starter project and build it. This will
also generate the models with the schema packaged as part of the started
project.

```shell
cd tigrisdb-starter-java-1.0.0-alpha.3
mvn clean install
```

### 4. Insert and read data

The following code will set up a HTTP handler that will leverage TigrisDB to
insert data into the _orders_ collection while updating the data in _users_ and
_products_ collections.

:::info
One of the main features of TigrisDB is the ability to perform ACID
transactions. We will perform the insert and update operations in a
transaction ensuring that the collections are consistently updated.

:::

Open the project in your favorite IDE and add the following method to
`com.tigrisdata.starter.controller.OrderController`

```java title="OrderController.java"
@PostMapping("{user_id}/{product_id}/{qty}")
public ResponseEntity<String> purchase(
    @RequestParam("user_id") long userId,
    @RequestParam("product_id") long productId,
    @RequestParam("qty") int quantity)
    throws TigrisDBException {

  // Begin the transaction and perform all operations below in the context of
  // this transaction
  TransactionSession transactionSession =
      tigrisStarterDatabase.beginTransaction(new TransactionOptions());

  try {
    // read the user and product documents
    User user = userCollection.readOne(Filters.eq("id", userId)).get();
    Product product = productCollection.readOne(Filters.eq("id", productId)).get();

    // ensure that a user is never allowed to purchase products worth more than
    // their available balance, and that we never create orders that exceed the
    // amount of available product
    if (product.getQuantity() >= quantity && product.getPrice() * quantity <= user.getBalance()) {
      double orderTotal = product.getPrice() * quantity;
      double newUserBalance = user.getBalance() - orderTotal;
      int newProductQuantity = product.getQuantity() - quantity;
      userCollection.update(
          Filters.eq("id", userId),
          UpdateFields.newBuilder()
              .set(UpdateFields.SetFields.newBuilder().set("balance", newUserBalance).build())
              .build());

      productCollection.update(
          Filters.eq("id", productId),
          UpdateFields.newBuilder()
              .set(
                  UpdateFields.SetFields.newBuilder().set("quantity", newProductQuantity).build())
              .build());

      orderCollection.insert(
          new Order()
              .withId(orderIdSequence.incrementAndGet())
              .withOrderTotal(orderTotal)
              .withUserId(userId)
              .withProductId(productId));

      // commit the transaction to persist all the changes
      transactionSession.commit();
      return ResponseEntity.status(HttpStatus.OK).body("Purchased successfully");
    } else {
      transactionSession.rollback();
      return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body("Not enough balance");
    }
  } catch (Exception ex) {
    transactionSession.rollback();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to shop");
  }
}
```

Now launch the application from the IDE.

An example using IntelliJ IDEA is shown below
![launcher window image](/img/screenshots/launcher_window.png)

A successful launch of the application will end with the log entry
`[main] INFO c.t.s.spring.TigrisDBInitializer - Finished initializing TigrisDB`

Congratulations, you just wrote a REST service which uses TigrisDB as the
backend. Take a look at the REST API at
[http://localhost:8080/swagger.html](http://localhost:8080/swagger.html).

### Understanding what just happened

The downloaded starter project included the data model definition consisting
of three collections `users`, `products` and `orders` located at
`src/main/resources/tigrisdb-schema`.

When you built the project, the Maven build configuration invoked the TigrisDB
model generator maven plugin that read the data model definition and generated
corresponding Java models.

You wrote a new HTTP handler that used TigrisDB transaction feature. The
transaction involved reading data, validating that certain conditions around
the product quantity and user's balance are met, and finally inserting a new
order together with updating the users and products collections.
