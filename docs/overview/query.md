# Querying

Tigris provides powerful query functionality for specifying which documents you want to retrieve. There is no need to
index any field as Tigris allows querying on any field of a document.

## Specification

```shell
{
  "fields": {
    <field1>: 1|0,
    <field2>: 1|0,
  },
  "filter": {
    <field1>: number|string|boolean,
    <field2>: {<$lt|$lte|$gt|$gte>: number},
    <$and|$or>: [<field3>: number|string|boolean, expr1, expr2...]
  },
  "options": {
    "limit": number
  }
}
```

Understanding the syntax:

- The `fields` projection allows you to specify which field to include by setting it to 1 or exclude it by setting it to 0. By default, all the fields are returned in the response.
- The `filter` syntax is documented in the following section.
- The `options` allows you to paginate the result.

## Filter

Filter provides the following comparison operators with the same semantics as in virtually all programming languages.

- **$eq**: equal to is used for exact matching.
- **$lt**: less than is used for matching documents using less than criteria.
- **$lte**: less than or equal to is similar to $lt but also matches for equality.
- **$gt**: greater than is used for matching documents using greater than criteria.
- **$gte**: greater than or equal to is similar to $gt but also matches for equality.

For multiple conditions, there are two logical operators supported.

- **$or**: Combines multiple filter operators and returns documents when either condition is met.
- **$and**: Combines multiple filter operators and returns documents when all the conditions are met.

### Specification

The JSON representation of the filter is shown below.

```shell
{
  "filter": {
    <field1>: number|string|boolean,
    <field2>: {<$lt|$lte|$gt|$gte>: number},
    <$and|$or>: [<field3>: number|string|boolean, expr1, expr2...]
  }
}
```

Understanding the representation:

- On the left either you can have a field name or you can specify a logical operator. On the right, either you can have a value or an expression.
- An `expr` inside logical operator can be a simple condition, or multiple conditions combined using nested logical operators.
- For `$eq`: a matching value can be of type numeric, string or boolean.
- For `$lt, $lte, $gt, $gte`: only numeric values are allowed.

:::note
Observe that when no comparison operator is passed then `$eq` is assumed. Similarly, unless explicitly provided `$and` is assumed on the top level conditions.
:::

## Example Collection

Assuming an e-commerce website that has a collection catalog and has 5 products(documents) in it.

| id  | name           | price | brand        | labels   | popularity | reviews                             |
| --- | -------------- | ----- | ------------ | -------- | ---------- | ----------------------------------- |
| 1   | fiona handbag  | 99.9  | michael kors | purses   | 8          | {"author": "alice", "rating": 7}    |
| 2   | tote bag       | 49    | coach        | handbags | 9          | {"author": "olivia", "rating": 8.3} |
| 3   | sling bag      | 75    | coach        | purses   | 9          | {"author": "alice", "rating": 9.2}  |
| 4   | sneakers shoes | 40    | adidas       | shoes    | 10         | {"author": "olivia", "rating": 9}   |
| 5   | running shoes  | 89    | nike         | shoes    | 10         | {"author": "olivia", "rating": 8.5} |

## Simple read query

A straightforward query is to read documents by applying a filter on a field. As an example, applying the filter on the
above collection by reading only the products that are of `brand` "adidas".

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read' \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"filter": {
		"brand": "adidas"
	}
  }'
```

:::note
String comparison is case sensitive.
:::

## Reading specific fields

Instead of reading all the fields of a document, fields projection allows reading specific fields. As an above example,
let's say you only need to read `name`, `price` and `brand` fields from a document.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read' \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
	"fields": {
		"name": 1,
		"price": 1,
		"brand": 1
	},
	"filter": {
		"brand": "adidas"
	}
  }'
```

:::note
To exclude replace 1 with 0.
:::

## Filtering on multiple fields

Instead of applying a single condition, what if you need to also filter by `price`. Following is an example where we are
reading all the products where `brand` is "adidas" and `price` is less than 50.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {
		"brand": "adidas",
		"price": {
			"$lt": 50
		}
	}
  }'
```

## Applying range conditions

Many times the need for filtering is based on range on a numeric field. A range can be applied to any numeric field and
in fact multiple numeric fields can be part of a single filter. Let’s take an example of reading all the products that
are `price` less than 50 and have a `popularity` score of greater than or equal to 8.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {
		"price": {
			"$lt": 50
		},
		"popularity": {
			"$gte": 8
		}
	}
  }'
```

## Applying logical filters

Even after applying multiple AND conditions, what if you need something even more complex? What about reading documents
where we need a logical `OR` on `brand` but also need to apply logical `AND` on some other fields. Let's read products where the
`brand` is either "adidas" or "coach" but the `price` should be less than 50 and the product should be `popular`.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {
		"$or": [{
			"brand": "adidas"
		}, {
			"brand": "coach"
		}],
		"price": {
			"$lt": 50
		},
		"popularity": {
			"$gte": 8
		}
	}
  }'
```

> The logical operators expects at least two conditions.

## Querying nested fields

As we can see all the above examples are for top level fields but what if you have an object, and you want to filter
documents based on one of the nested field. Taking the above data, if you want to get all the products which have `labels`
set as "shoes" but should have `ratings` greater than 7.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {
		"labels": "shoes",
		"reviews.ratings": {
			"$gt": 7
		}
	}
  }'
```

## Limits and Pagination

Limiting the number of documents to read can be done by passing limit option during read request.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {
		"labels": "shoes"
	},
	"options": {
		"limit": 10
	}
  }'
```

## Reading all documents in a collection

You can also read all documents from your collection by passing an empty filter like below.

```shell
curl 'http://localhost:8081/api/v1/databases/catalogdb/collections/catalog/documents/read'
  -X POST
  -H "Content-Type: application/json"
  -d '{
	"filter": {}
  }'
```
