# Declaring Models

Models are regular Java model (POJO) comprised of primitive and wrapper Java
types, or custom types.

```java
import com.tigrisdata.db.annotation.TigrisField;
import com.tigrisdata.db.annotation.TigrisPrimaryKey;
import com.tigrisdata.db.type.TigrisCollectionType;

import java.util.Objects;

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
```

This declaration will create a collection named `users`.

## Collection Names

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

## Field Names

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
