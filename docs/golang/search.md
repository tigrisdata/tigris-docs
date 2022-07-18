# Searching

Tigris offers a realtime search for documents in a collection. Searching is by default enabled for a
collection, there is no setup. This guide section will walk through how to use Tigris search in
different scenarios.

### Example collection

Assuming an e-commerce website that has a collection catalog and has 6 products(documents) in it.

| id  | name           | price | brand        | labels   | popularity | reviews                             |
| --- | -------------- | ----- | ------------ | -------- | ---------- | ----------------------------------- |
| 1   | fiona handbag  | 99.9  | michael kors | purses   | 8          | {"author": "alice", "rating": 7}    |
| 2   | tote bag       | 49    | coach        | handbags | 9          | {"author": "olivia", "rating": 8.3} |
| 3   | sling bag      | 75    | coach        | purses   | 9          | {"author": "alice", "rating": 9.2}  |
| 4   | sneakers shoes | 40    | adidas       | shoes    | 10         | {"author": "olivia", "rating": 9}   |
| 5   | running shoes  | 89    | nike         | shoes    | 10         | {"author": "olivia", "rating": 8.5} |
| 6   | running shorts | 35    | adidas       | clothing | 7          | {"author": "olivia", "rating": 7.5} |

The first step is to create the collection object.

```go
catalog := GetCollection[Catalog](catalogdb)
```

## Searching for documents

Search consists for a query against one or more text fields. Let's perform a simple search query to
lookup any items matching "running"

```go
request := search.NewRequestBuilder().WithQuery("running").Build()
it, err := catalog.Search(ctx, request)

if err != nil {
    // handle error
}

defer it.Close()

var result search.Result[Catalog]
for it.Next(&result) {
    fmt.Printf("%+v\n", result)
}

if it.Err() != nil {
    // handle error
}
```

### Match all search query

When query string isn't specified or an empty string (`""`), a match all query is performed.
It returns all searchable documents, modified by any filters or search parameters used.

```go
request := search.NewRequestBuilder().Build()
```

:::tip
Returning all documents is typically useful when used in conjunction with **filter**, or when
performing a faceted search across the collection.
:::

## Project search query against specific fields

We can optionally project the search query against selected fields. Continuing previous example of
searching for "running", we may not want to search in `reviews` field and avoid any
unwanted results.

```go
request := search.NewRequestBuilder().
                WithQuery("running").
                WithSearchFields("name", "labels").
                Build()
```

## Refine the search results using filters

Let's adjust the query to only return items in `price` range of **[40, 90)**. We can use
[Tigris filters](query#filter) in search to further refine the results.

```go
request := search.NewRequestBuilder().
                WithQuery("running").
                WithSearchFields("name", "labels").
			    WithFilter(
				    filter.And(
					    filter.Gte("price", 40), filter.Lt("price", 90),
				    )).
                Build()
```

### Exact text match

Filters can be used to match against one or more field values in a collection. For example, to
fetch all items from `brand` "adidas"

```go
request := search.NewRequestBuilder().
                WithFilter(filter.Eq("brand", "adidas")).
                Build()
```

## Faceted search

We can additionally retrieve the number of items a particular `brand` has and unique `labels`,
that match our search query.

```go
request := search.NewRequestBuilder().
                WithQuery("running").
                WithSearchFields("name", "labels").
			    WithFilter(
				    filter.And(
					    filter.Gte("price", 40), filter.Lt("price", 90),
				    )).
				WithFacetFields("brand", "labels").
                Build()
```

Facets are a specific use-case of filters, and can only be used for filterable attributes.

:::tip Faceted content navigation UI
Common application for faceted search is to build UX with quick filters, that users can use
to narrow search results in real-time. Faceted search interface presents intuitive content
navigation to the end user.
:::

## Reading specific fields

Similar to [field projection in query](query#reading-specific-fields), a search query can be
programmed to return only specific fields of a document in search results

```go
request := search.NewRequestBuilder().
                WithQuery("running").
                WithReadFields(
                    fields.Include("name").Include("price").Include("brand")).
                Build()
```
