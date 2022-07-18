# Querying

Tigris provides powerful query functionality for specifying which documents you want to retrieve. There is no need to
index any field as Tigris allows querying on any field of a document.

## Filter

Filter provides the following comparison operators with the same semantics as in virtually all programming languages.

- **SelectorFilterOperator.EQ**: equal to is used for exact matching.
- **SelectorFilterOperator.LT**: less than is used for matching documents using less than criteria.
- **SelectorFilterOperator.LTE**: less than or equal to is similar to $lt but also matches for equality.
- **SelectorFilterOperator.GT**: greater than is used for matching documents using greater than criteria.
- **SelectorFilterOperator.GTE**: greater than or equal to is similar to $gt but also matches for equality.

For multiple conditions, there are two logical operators supported.

- **LogicalOperator.OR**: Combines multiple filter operators and returns documents when either condition is met.
- **LogicalOperator.AND**: Combines multiple filter operators and returns documents when all the conditions are met.

## Example Collection

Assuming an e-commerce website that has a collection catalog and has 5 products(documents) in it.

| id  | name           | price | brand        | labels   | popularity | reviews                             |
| --- | -------------- | ----- | ------------ | -------- | ---------- | ----------------------------------- |
| 1   | fiona handbag  | 99.9  | michael kors | purses   | 8          | {"author": "alice", "rating": 7}    |
| 2   | tote bag       | 49    | coach        | handbags | 9          | {"author": "olivia", "rating": 8.3} |
| 3   | sling bag      | 75    | coach        | purses   | 9          | {"author": "alice", "rating": 9.2}  |
| 4   | sneakers shoes | 40    | adidas       | shoes    | 10         | {"author": "olivia", "rating": 9}   |
| 5   | running shoes  | 89    | nike         | shoes    | 10         | {"author": "olivia", "rating": 8.5} |

## Reading a single document

A straightforward query is to read a single document by applying a filter on a field. As an example, applying the filter on the
above collection by reading only a single product that is of `brand` "adidas".

```javascript

catalog.findOne({
    op: SelectorFilterOperator.EQ,
    fields: {
        brand: "adidas"
    }
}).then(value => {
    const product: Catalog = <Catalog>value;
    console.log(product.name); // 'sneakers shoes'
    console.log(product.price); // 40
});
```

:::note
String comparison is case sensitive.
:::

## Filtering on multiple fields

Single field filtering is useful but what if you need to also filter by `price`. Following is an example where we are
reading all the products where `brand` is "adidas" and `price` is less than 50.

```javascript
catalog.findMany({
    op: LogicalOperator.AND,
    selectorFilters: [
        {
            brand: "adidas"
        },
        {
            op: SelectorFilterOperator.LT,
            fields: {
                price: 50
            }
        }
    ]
}).then(value => {
    const products: Catalog[] = <Catalog[]>value;
    for (const i in products) {
        console.log(products[i]);
    }
});
```

## Reading specific fields

Instead of reading all the fields of a document, fields projection allows reading specific fields. As an above example,
let's say you only need to read `name`, `price` and `brand` fields from a document.

```javascript
catalog.findMany({
    op: LogicalOperator.AND,
    selectorFilters: [
    {
        brand: "adidas"
    },
    {
        op: SelectorFilterOperator.LT,
        fields: {
            price: 50
        }
    }
    ]
}, {
    include: ["name", "price", "brand"],
}).then(value => {
    const products: Catalog[] = <Catalog[]>value;
    for (const i in products) {
        console.log(products[i]);
    }
});
```

:::note
To exclude use fields.Exclude("fieldName").
:::

## Applying range conditions

Many times the need for filtering is based on range on a numeric field. A range can be applied to any numeric field and
in fact multiple numeric fields can be part of a single filter. Let’s take an example of reading all the products that
are `price` less than 50 and have a `popularity` score of greater than or equal to 8.

```javascript
catalog.findMany({
    op: LogicalOperator.AND,
    selectorFilters: [
        {
            op: SelectorFilterOperator.LT,
            fields: {
                price: 50
            }
        },
        {
            op: SelectorFilterOperator.GTE,
            fields: {
                popularity: 8
            }
        }
    ]
}).then(value => {
    const products: Catalog[] = <Catalog[]>value;
    for (const i in products) {
        console.log(products[i]);
    }
});
```

## Applying multiple logical filters

Even after applying multiple AND conditions, what if you need something even more complex? What about reading documents
where we need a logical `OR` on `brand` but also need to apply logical `AND` on some other fields. Let's read products where the
`brand` is either "adidas" or "coach" but the `price` should be less than 50 and the product should be `popular`.

```javascript
const logicalFilter: LogicalFilter <ProductCatalog> = {
    op: LogicalOperator.OR,
    selectorFilters: [
        {
            op: SelectorFilterOperator.LT,
            price: 50
        },
        {
            op: SelectorFilterOperator.GTE,
            popularity: 8
        }
    ],
    logicalFilters: [{
        op: LogicalOperator.AND,
        selectorFilters: [
            {
                op: SelectorFilterOperator.LT,
                price: 50
            },
            {
                op: SelectorFilterOperator.GTE,
                popularity: 8
            }
        ]
    }],
};

catalog.findMany(logicalFilter).then(value => {
    const products: Catalog[] = <Catalog[]>value;
    for (const i in products) {
        console.log(products[i]);
    }
});
```

## Querying nested fields

As we can see all the above examples are for top level fields but what if you have an object, and you want to filter
documents based on one of the nested field. Taking the above data, if you want to get all the products which have `labels`
set as "shoes" but should have `ratings` greater than 7.

```javascript
catalog.findMany({
    op: LogicalOperator.AND,
    selectorFilters: [
        {
            labels: "shoes"
        },
        {
            op: SelectorFilterOperator.GT,
            fields: {
                reviews.ratings: 7
            }
        }
    ]
}).then(value => {
    const products: Catalog[] = <Catalog[]>value;
    for (const i in products) {
        console.log(products[i]);
    }
});
```

## Reading all the documents in a collection

You can also read all documents from your collection by passing an empty filter like below.

```javascript
catalog.findAllStream({
  onEnd() {
    // handle onEnd
  },
  onNext(product: Product) {
    console.log(product);
  },
  onError(_error: Error) {
    console.log(_error);
  },
});
```
