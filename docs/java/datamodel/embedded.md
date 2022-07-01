# Embedded Data Model

Tigris offers rich documents that enable embedding related data in a single
document. Embedded models allow applications to complete database operations
with fewer queries or updates, thus reducing query activity and increasing
efficiency.

Below is an example of embedded data model. We first define the `Product`
type and then embed it inside the `Order` type.

```java
public class Product implements TigrisCollectionType {

    @TigrisField(description = "A unique identifier for the product")
    @TigrisPrimaryKey(order = 1, autoGenerate = true)
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

    @TigrisPrimaryKey(order = 1, autoGenerate = true)
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
