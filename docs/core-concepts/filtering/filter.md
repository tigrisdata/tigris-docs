# Filter

Tigris offers powerful apis to read or search the data. These APIs support filters to add specific criteria that the
documents must match in order to return only the most relevant documents.

A filter can be used to specify conditions using comparison operators, or can be used by specifying multiple conditions
by using logical operators `AND`, and `OR`.

Filter provides the following comparison operators with the same semantics as in virtually all programming languages.

- **$eq**: equal to is used for exact matching.
- **$lt**: less than is used for matching documents using less than criteria.
- **$lte**: less than or equal to is similar to $lt but also matches for equality.
- **$gt**: greater than is used for matching documents using greater than criteria.
- **$gte**: greater than or equal to is similar to $gt but also matches for equality.

For multiple conditions, there are two logical operators supported.

- **$or**: Combines multiple filter operators and returns documents when either condition is met.
- **$and**: Combines multiple filter operators and returns documents when all the conditions are met.

## Specification

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

### Examples

#### Simple Filter

Let's start with finding documents which are based on straightforward checks on equality. For instance, return all products for an e-commerce
website where `brand` is _"adidas"_.

```json
{
  "brand": "adidas"
}
```

> No comparison operator specified which means equality is assumed.

Similarly, adding one more condition and extending the example further to get products where the `brand` is _"adidas"_ but the `price` is strictly less than _100_:

```json
{
  "brand": "adidas",
  "price": { "$lt": 100 }
}
```

> No logical operator specified which means logically AND is assumed.

The range condition is not limited to a single field but can be applied on multiple fields. Extending the example further
now to check products that are for `brand` _"adidas"_, have `price` less than _100_ and have `popularity` score of at least _8_.

```json
{
  "brand": "adidas",
  "price": { "$lt": 100 },
  "popularity": { "$gte": 8 }
}
```

#### Logical Filter

Oftentimes the top level conditions are not enough and there is a need of adding conditions of either/or nature. The filter
allows adding explicit logical operators and supports even nested conditions based on these operators.

Taking the above example further, let's find documents that are of `brand` _"adidas"_ or _"nike"_ but still have `price`
less than _100_ and have `popularity` score of at least _8_.

```json
{
  "$or": [{ "brand": "adidas" }, { "brand": "nike" }],
  "price": { "$lt": 100 },
  "popularity": { "$gte": 8 }
}
```

> The logical operators expects at least two conditions.

But what about if one of the `OR` condition needs a combination of `AND` i.e. nested conditions. In the same example, either
the `brand` is "adidas" or the `brand` is _"coach"_ and `category` is _"handbag"_.

```json
{
  "$or": [
    { "brand": "adidas" },
    { "$and": [{ "brand": "coach" }, { "category": "handbag" }] }
  ],
  "price": { "$lt": 100 },
  "popularity": { "$gte": 8 }
}
```
