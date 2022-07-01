# Embedded Data Model

Tigris offers rich documents that enable embedding related data in a single
document. Embedded models allow applications to complete database operations
with fewer queries or updates, thus reducing query activity and increasing
efficiency.

Below is an example of embedded data model. We first define the `Product`
type and then embed it inside the `Order` type.

```go
type Product struct {
	Id       int `tigris:"primaryKey,autoGenerate"`
	Name     string
	Quantity int
	Price    float64
}

type Order struct {
	Id     int `tigris:"primaryKey,autoGenerate"`
	UserId int

	Products []Product
}
```
