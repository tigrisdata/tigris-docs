# Data Modeling Using Java

Tigris enables the data models to be declared as part of the
application code. These data models are then converted to appropriate
objects, such as collections, on the backend.

In this section we will cover data modeling using Java.

## Declaring Models

Models are regular Java model (POJO) composed of primitive and wrapper Java
types or custom types. These models are not tightly coupled with Tigris and
can be
shared with other modules of your project.

```java
import com.tigrisdata.db.annotation.TigrisField;
import com.tigrisdata.db.annotation.TigrisPrimaryKey;
import com.tigrisdata.db.type.TigrisCollectionType;

import java.util.Objects;

public class User implements TigrisCollectionType {
  @TigrisField(description = "A unique identifier for the user")
  @TigrisPrimaryKey(1)
  private int id;

  @TigrisField(description = "Name of the user")
  private String name;

  @TigrisField(description = "User account balance")
  private double balance;

  public User() {}

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
```

This declaration will create a collection named `users` with the following
schema on Tigris

```json
{
  "title": "users",
  "additionalProperties": false,
  "type": "object",
  "properties": {
    "balance": {
      "type": "number",
      "format": "double",
      "description": "User account balance"
    },
    "id": {
      "type": "integer",
      "format": "int32",
      "description": "A unique identifier for the user"
    },
    "name": {
      "type": "string",
      "description": "Name of the user"
    }
  },
  "primary_key": ["id"]
}
```

### Collection Names

The name of the collection is derived from the Java class name. The class name
name is pluralized to snake_cases as collection name. For example, the
Java class name `User` is converted to `users` as the collection name. While
the Java class name `UserDetail` is converted to `user_details` as the
collection name. User can optionally customize their collection name by
using `@TigrisCollection` annotation. For example below will create Tigris
collection named `system_users`.

```java
@TigrisCollection("system_users")
public class User implements TigrisCollectionType {
    // body same as above
}
```

### Field Names

The name of the field member in the Java class are used as the field names
in the collection's schema. There is no conversion performed by default.
Optionally to add description to your fields you can use annotation
`@TigrisField` as below

```java
public class User implements TigrisCollectionType {

    @TigrisField(description = "Name of the user")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(name, user.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
```

### Defining Primary Key

Every collection must have a primary key. One or more fields in the Java class
can be specified as primary key by using `@TigrisPrimaryKey(1)` annotation.
Note: the number represents the order of primary key. In below example field
`id` is the single primary key field.

```java
public class User implements TigrisCollectionType {
    @TigrisPrimaryKey(1)
    private int id;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

Composite primary keys are also supported but in case of composite keys
order of the fields is important. The example below demonstrates
how the order of the fields are defined in case of a composite primary key

```java
public class User implements TigrisCollectionType {
    @TigrisPrimaryKey(1)
    private int id;

    @TigrisPrimaryKey(2)
    private String email;

    private int age;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && age == user.age && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, age);
    }
}
```

The class definition above will result in the following collection schema

```json
{
  "title": "users",
  "additionalProperties": false,
  "type": "object",
  "properties": {
    "age": {
      "type": "integer",
      "format": "int32"
    },
    "email": {
      "type": "string"
    },
    "id": {
      "type": "integer",
      "format": "int64"
    }
  },
  "primary_key": ["id", "email"]
}
```

### Embedded Data Model

Tigris offers rich documents that enable embedding related data in a single
document. Embedded models allow applications to complete database operations
with fewer queries or updates, thus reducing query activity and increasing
efficiency.

Below is an example of embedded data model. We first define the `Product`
type and then embed it inside the `Order` type.

```java
public class Product implements TigrisCollectionType {

    @TigrisField(description = "A unique identifier for the product")
    @TigrisPrimaryKey(1)
    private int id;

    @TigrisField(description = "Name of the product")
    private String name;

    @TigrisField(description = "Number of products available in the store")
    private int quantity;

    @TigrisField(description = "Price of the product")
    private double price;

    public Product() {}

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id == product.id
                && quantity == product.quantity
                && Double.compare(product.price, price) == 0
                && Objects.equals(name, product.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, quantity, price);
    }
}

public class Order implements TigrisCollectionType {

    @TigrisPrimaryKey(1)
    private long id;
    private long userId;
    private Product[] products;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public Product[] getProducts() {
        return products;
    }

    public void setProducts(Product[] products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order2 order2 = (Order2) o;
        return id == order2.id && userId == order2.userId && Arrays.equals(products, order2.products);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, userId);
        result = 31 * result + Arrays.hashCode(products);
        return result;
    }
}
```

The model definition above will result in the following collection schema

```json
{
  "title": "orders",
  "additionalProperties": false,
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32",
            "description": "A unique identifier for the product"
          },
          "name": {
            "type": "string",
            "description": "Name of the product"
          },
          "price": {
            "type": "number",
            "format": "double",
            "description": "Price of the product"
          },
          "quantity": {
            "type": "integer",
            "format": "int32",
            "description": "Number of products available in the store"
          }
        }
      }
    },
    "userId": {
      "type": "integer",
      "format": "int64"
    }
  },
  "primary_key": ["id"]
}
```

### Supported Java Types

Tigris supports the majority of the primitive Java types while also providing
support for custom types.

- primitive types: `boolean`, `byte`, `short`, `int`, `long`, `float`, `double`
- wrapper types: `Boolean`, `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`
- Utility types: `java.util.Date`, `java.util.UUID`, `java.util.List`, `java.util. Map`, `java.util.Set`, `java.util.Collection`
- Array: arrays of above all primitive and wrappers
- Custom types: Custom user class to define custom types
