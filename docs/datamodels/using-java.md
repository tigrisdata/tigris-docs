# Data Modeling Using Java

Tigris enables the data models to be declared as part of the
application code. These data models are then converted to appropriate
objects, such as collections, on the backend.

In this section we will cover data modeling using Java.

## Declaring Models

Models are regular Java model (POJO) comprised of primitive and wrapper Java
types, or custom types.

```java
import com.tigrisdata.db.annotation.TigrisField;
import com.tigrisdata.db.annotation.TigrisPrimaryKey;
import com.tigrisdata.db.type.TigrisCollectionType;

import java.util.Objects;

public class User implements TigrisCollectionType {
  @TigrisField(description = "A unique identifier for the user")
  @TigrisPrimaryKey(order = 1)
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

This declaration will create a collection named `users`.

### Collection Names

The name of the collection is derived from the Java class name. The class name
name is pluralized to snake_cases as collection name. For example, the
Java class name `User` is converted to `users` as the collection name. While
the Java class name `UserDetail` is converted to `user_details` as the
collection name.

In the majority of the cases you will not need to customize the collection name,
but if you do, you can customize the collection name by using the
`@TigrisCollection` annotation. For example, the code sample below creates a
collection named `system_users`.

```java
@TigrisCollection("system_users")
public class User implements TigrisCollectionType {
    //...
}
```

### Field Names

The field names in the Java class definition are also used as the field names
in the collection's schema. There is no conversion performed by default.

You can optionally add description to your fields by using the annotation
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

Every collection can have zero or more fields as primary key. If user
doesn't specify any field as primary key, Tigris will automatically add
`_id` field as the primary key with type `UUID`.

The example below demonstrates how primary key is defined. The number in
`@TigrisPrimaryKey(order = 1)` represents the order of the field in the primary
key.

```java
public class User implements TigrisCollectionType {
    @TigrisPrimaryKey(order = 1)
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
    @TigrisPrimaryKey(order = 1)
    private int id;

    @TigrisPrimaryKey(order = 2)
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

If user did not have a primary key in their collection Java model to begin
with. At later point they can still bind the generated primaryKey by adding a
field with name `_id` and type `java.util.UUID` as shown below.

```java

public class Order implements TigrisCollectionType {
  private UUID _id; // <-- this
  private long buyerId;
  private long sellerId;
  private double tradePrice;

  public UUID get_id() {
    return _id;
  }

  public void set_id(UUID _id) {
    this._id = _id;
  }

  public long getBuyerId() {
    return buyerId;
  }

  public void setBuyerId(long buyerId) {
    this.buyerId = buyerId;
  }

  public long getSellerId() {
    return sellerId;
  }

  public void setSellerId(long sellerId) {
    this.sellerId = sellerId;
  }

  public double getTradePrice() {
    return tradePrice;
  }

  public void setTradePrice(double tradePrice) {
    this.tradePrice = tradePrice;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Order order = (Order) o;
    return buyerId == order.buyerId
        && sellerId == order.sellerId
        && Double.compare(order.tradePrice, tradePrice) == 0;
  }

  @Override
  public int hashCode() {
    return Objects.hash(buyerId, sellerId, tradePrice);
  }
}

```

Alternatively if users want to use different field name they can do that as
follows. In below example the field named `orderId` will be mapped to auto
generated field `_id`. (for both reads/writes)

```java
public class OrderCustomized implements TigrisCollectionType {
  private long buyerId;
  private long sellerId;
  private double tradePrice;

  @TigrisField(autoGeneratedFieldMapping = AutoGeneratedFields._ID) // <-- this
  private UUID orderId;

  public UUID getOrderId() {
    return orderId;
  }

  public void setOrderId(UUID orderId) {
    this.orderId = orderId;
  }

  public long getBuyerId() {
    return buyerId;
  }

  public void setBuyerId(long buyerId) {
    this.buyerId = buyerId;
  }

  public long getSellerId() {
    return sellerId;
  }

  public void setSellerId(long sellerId) {
    this.sellerId = sellerId;
  }

  public double getTradePrice() {
    return tradePrice;
  }

  public void setTradePrice(double tradePrice) {
    this.tradePrice = tradePrice;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    OrderCustomized that = (OrderCustomized) o;
    return buyerId == that.buyerId
        && sellerId == that.sellerId
        && Double.compare(that.tradePrice, tradePrice) == 0
        && Objects.equals(orderId, that.orderId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(buyerId, sellerId, tradePrice, orderId);
  }
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

### Supported Java Types

Tigris supports the majority of the primitive Java types while also providing
support for custom types.

- primitive types: boolean, byte, short, int, long, float, double
- wrapper types: Boolean, Byte, Short, Integer, Long, Float, Double
- Utility types: java.util.Date, java.util.UUID, java.util.List, java.util.Map, java.util.Collection
- Array: array type supporting all the above primitive and wrapper types
- Custom types: user-defined class to define custom types
