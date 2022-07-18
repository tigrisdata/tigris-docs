# Querying

Tigris provides powerful query functionality for specifying which documents you want to retrieve. There is no need to
index any field as Tigris allows querying on any field of a document.

## Filter

Filter provides the following comparison operators with the same semantics as in virtually all programming languages.

- **Filters.eq**: equal to is used for exact matching.
- **Filters.lt**: less than is used for matching documents using less than criteria.
- **Filters.lte**: less than or equal to is similar to $lt but also matches for equality.
- **Filters.gt**: greater than is used for matching documents using greater than criteria.
- **Filters.gte**: greater than or equal to is similar to $gt but also matches for equality.

For multiple conditions, there are two logical operators supported.

- **Filters.or**: Combines multiple filter operators and returns documents when either condition is met.
- **Filters.and**: Combines multiple filter operators and returns documents when all the conditions are met.

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

```java
TigrisCollection<Catalog> catalog = tigrisDatabase.getCollection(Catalog.class);
```

## Simple read query

A straightforward query is to read documents by applying a filter on a field. As an example, applying the filter on the
above collection by reading only the products that are of `brand` "adidas".

```java
Catalog product = catalog.readOne(Filters.eq("brand", "adidas"))
System.out.println(product);
```

:::note
String comparison is case sensitive.
:::

## Filtering on multiple fields

Single field filtering is useful but what if you need to also filter by `price`. Following is an example where we are
reading all the products where `brand` is "adidas" and `price` is less than 50.

```java
Iterator<Catalog> iterator = catalog.read(
    Filters.and(
        Filters.eq("brand", "adidas"),
        Filters.lt("price", 50)
    )
);
while (iterator.hasNext()) {
    Catalog product = iterator.next();
    System.out.println(product);
}
```

## Reading specific fields

Instead of reading all the fields of a document, fields projection allows reading specific fields. As an above example,
let's say you only need to read `name`, `price` and `brand` fields from a document.

```java
Iterator<Catalog> iterator = catalog.read(
    Filters.and(
        Filters.eq("brand", "adidas"),
        Filters.lt("price", 50)
    ),
    ReadFields.newBuilder().includeField("name").includeField("price").includeField("brand").build()
);
while (iterator.hasNext()) {
    Catalog product = iterator.next();
    System.out.println(product);
}
```

:::note
To exclude use excludeField("fieldName").
:::

## Applying range conditions

Many times the need for filtering is based on range on a numeric field. A range can be applied to any numeric field and
in fact multiple numeric fields can be part of a single filter. Let’s take an example of reading all the products that
are `price` less than 50 and have a `popularity` score of greater than or equal to 8.

```java
Iterator<Catalog> iterator = catalog.read(
    Filters.and(
        Filters.lt("price", 50),
        Filters.gte("popularity", 8)
    )
);
while (iterator.hasNext()) {
    Catalog product = iterator.next();
    System.out.println(product);
}
```

## Applying multiple logical filters

Even after applying multiple AND conditions, what if you need something even more complex? What about reading documents
where we need a logical `OR` on `brand` but also need to apply logical `AND` on some other fields. Let's read products where the
`brand` is either "adidas" or "coach" but the `price` should be less than 50 and the product should be `popular`.

```java
Iterator<Catalog> iterator = catalog.read(
    Filters.and(
        Filters.or(
            Filters.eq("brand", "adidas"),
	        Filters.eq("brand", "coach")
	    ),
        Filters.and(
            Filters.lt("price", 50),
            Filters.gte("popularity", 8)
        )
    )
);
while (iterator.hasNext()) {
  Catalog product = iterator.next();
  System.out.println(product);
}
```

## Querying nested fields

As we can see all the above examples are for top level fields but what if you have an object, and you want to filter
documents based on one of the nested field. Taking the above data, if you want to get all the products which have `labels`
set as "shoes" but should have `ratings` greater than 7.

```java
Iterator<Catalog> iterator = catalog.read(
    Filters.and(
        Filters.eq("labels", "shoes"),
        Filters.gt("reviews.ratings", 7)
    )
);
while (iterator.hasNext()) {
    Catalog product = iterator.next();
    System.out.println(product);
}
```

## Reading all the documents in a collection

You can also read all documents from your collection by calling readAll API.

```java
Iterator<Catalog> iterator = catalog.readAll()
while (iterator.hasNext()) {
  Catalog product = iterator.next();
  System.out.println(product);
}
```
