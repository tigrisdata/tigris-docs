# Querying

Tigris provides powerful query functionality for specifying which documents you want to retrieve. There is no need to
index any field as Tigris allows querying on any field of a document.

## Filter

Filter provides the following comparison operators with the same semantics as in virtually all programming languages.

- **filter.Eq**: equal to is used for exact matching.
- **filter.Lt**: less than is used for matching documents using less than criteria.
- **filter.Lte**: less than or equal to is similar to $lt but also matches for equality.
- **filter.Gt**: greater than is used for matching documents using greater than criteria.
- **filter.Gte**: greater than or equal to is similar to $gt but also matches for equality.

For multiple conditions, there are two logical operators supported.

- **filter.Or**: Combines multiple filter operators and returns documents when either condition is met.
- **filter.And**: Combines multiple filter operators and returns documents when all the conditions are met.

## Example Collection

Assuming an e-commerce website that has a collection catalog and has 5 products(documents) in it.

| id  | name           | price | brand        | labels   | popularity | reviews                             |
| --- | -------------- | ----- | ------------ | -------- | ---------- | ----------------------------------- |
| 1   | fiona handbag  | 99.9  | michael kors | purses   | 8          | {"author": "alice", "rating": 7}    |
| 2   | tote bag       | 49    | coach        | handbags | 9          | {"author": "olivia", "rating": 8.3} |
| 3   | sling bag      | 75    | coach        | purses   | 9          | {"author": "alice", "rating": 9.2}  |
| 4   | sneakers shoes | 40    | adidas       | shoes    | 10         | {"author": "olivia", "rating": 9}   |
| 5   | running shoes  | 89    | nike         | shoes    | 10         | {"author": "olivia", "rating": 8.5} |

The first step is to create the collection object.

```shell
catalog := GetCollection[Catalog](catalogdb)
```

## Reading a single document

A straightforward query is to read a single document by applying a filter on a field. As an example, applying the filter on the
above collection by reading only a single product that is of `brand` "adidas".

```go
product, err := catalog.ReadOne(ctx, filter.Eq("brand", "adidas"))
if err != nil {
	panic(err)
}
fmt.Println(product)
```

:::note
String comparison is case sensitive.
:::

## Filtering on multiple fields

Single field filtering is useful but what if you need to also filter by `price`. Following is an example where we are
reading all the products where `brand` is "adidas" and `price` is less than 50.

```go
it, err := catalog.Read(ctx, filter.And(filter.Eq("brand", "adidas"), filter.Lt("price", 50)))
if err != nil {
	panic(err)
}
var product Catalog
for it.Next(&product) {
    fmt.Printf("%+v\n", product)
}
```

## Reading specific fields

Instead of reading all the fields of a document, fields projection allows reading specific fields. As an above example,
let's say you only need to read `name`, `price` and `brand` fields from a document.

```go
it, err := catalog.Read(ctx,
	filter.And(filter.Eq("brand", "adidas"), filter.Lt("price", 50)),
	fields.Include("name").Include("price").Include("brand")
)
if err != nil {
	panic(err)
}
var product Catalog
for it.Next(&product) {
    fmt.Printf("%+v\n", product)
}
```

:::note
To exclude use fields.Exclude("fieldName").
:::

## Applying range conditions

Many times the need for filtering is based on range on a numeric field. A range can be applied to any numeric field and
in fact multiple numeric fields can be part of a single filter. Let’s take an example of reading all the products that
are `price` less than 50 and have a `popularity` score of greater than or equal to 8.

```go
it, err := catalog.Read(ctx, filter.And(filter.Lt("price", 50), filter.Gte("popularity", 8)))
if err != nil {
	panic(err)
}
var product Catalog
for it.Next(&product) {
    fmt.Printf("%+v\n", product)
}
```

## Applying multiple logical filters

Even after applying multiple AND conditions, what if you need something even more complex? What about reading documents
where we need a logical `OR` on `brand` but also need to apply logical `AND` on some other fields. Let's read products where the
`brand` is either "adidas" or "coach" but the `price` should be less than 50 and the product should be `popular`.

```go
it, err := catalog.Read(ctx, filter.And(
	filter.Or(
        filter.Eq("brand", "adidas"),
	    filter.Eq("brand", "coach")),
	filter.And(
        filter.Lt("price", 50),
        filter.Gte("popularity", 8)),
	),
)
if err != nil {
    panic(err)
}
var product Catalog
for it.Next(&product) {
    fmt.Printf("%+v\n", product)
}
```

## Querying nested fields

As we can see all the above examples are for top level fields but what if you have an object, and you want to filter
documents based on one of the nested field. Taking the above data, if you want to get all the products which have `labels`
set as "shoes" but should have `ratings` greater than 7.

```go
it, err := catalog.Read(ctx, filter.And(filter.Eq("labels", "shoes"), filter.Gt("reviews.ratings", 7)))
if err != nil {
    panic(err)
}

var product Catalog
for it.Next(&product) {
    fmt.Printf("%+v\n", product)
}
```

## Reading all the documents in a collection

You can also read all documents from your collection by calling `ReadAll` API.

```go
it, err := catalog.ReadAll(ctx)
if err != nil {
    panic(err)
}
fmt.Println(iter)
```
