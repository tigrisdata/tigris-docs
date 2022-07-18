# CRUD Operations

Tigris enables you to quickly add data and easily retrieve or edit that data
through simple and intuitive APIs.

The first step is to set up the collection object. All the CRUD operations on
the collection are performed through this collection object.

```typescript
const users: Collection<User> = db.getCollection<User>("users");
```

## Insert documents

Use the `insert` API to insert one document, use `insertMany` for inserting more
than one documents into the collection. Since the `id` field is marked as
an `autoGenerate` field. You can set the value to `0` to let server autoGenerate
the value.

```typescript
const user: User = {
  firstName: "Jania",
  lastName: "McGrory",
  balance: 6045.7,
};

const insertedUser: User = await users.insert(user);
```

The insert API maintains uniqueness of the field marked as the primary key, for
example, the field `id` in the example above. If a document with the same
primary key value already exists in the collection, the insert fails.

## Upsert documents

Use the `insertOrReplace` API to insert a new document or replace an existing
document with the same primary key value. use `insertOrReplaceMany` to do the
same on more than one documents.

```typescript
const insertedOrReplacedDoc: User = await users.insertOrReplace({
  userId: 1,
  balance: 1000000,
  firstName: "Bunny",
  lastName: "Instone",
});
```

## Read single document

To read one document you can use `findOne()`, If filters are provided, then
documents matching the filtering condition are fetched.

```typescript
const user: User = await users.findOne({
  userId: 1,
});
```

### Read documents

To read multiple documents, use the `findMany()` or `findManyStream()` API.

```typescript
users.findMany({
  op: LogicalOperator.OR,
  selectorFilters: [
    {
      firstName: "alice",
    },
    {
      firstName: "emma",
    },
  ],
});
```

```typescript
users.findManyStream(
  {
    op: LogicalOperator.OR,
    selectorFilters: [
      {
        firstName: "alice",
      },
      {
        firstName: "emma",
      },
    ],
  },
  {
    onEnd() {
      // when find is finished
    },
    onNext(user: User) {
      // when the next user is fetched
    },
    onError(error: Error) {
      // in case of an error
    },
  }
);
```

## Search documents

To search for documents, use the `search()` API. Search consists of a query against text fields in a collection.

```typescript
const request: SearchRequest<User> = {
  q: "Jania",
};
users.search(request, {
  onEnd() {
    // when search completes
  },
  onNext(result: SearchResult<User>) {
    // when a search result is fetched
  },
  onError(error: Error) {
    // in case of an error
  },
});
```

### Project search query against specific fields

By default, query is projected against all the text fields in collection. To project query against specific fields:

```typescript
const request: SearchRequest<User> = {
  q: "Jania",
  searchFields: ["firstName", "lastName"],
};
```

### Refine the search results

[Filters](../overview/filter.md) can be applied to further refine the search results.

```typescript
const request: SearchRequest<User> = {
  q: "Jania",
  searchFields: ["firstName", "lastName"],
  filter: { balance: 2000 },
};
```

### Facet the search results

Optionally, facet query can be specified to retrieve aggregate count of values for one or more fields.

```typescript
const request: SearchRequest<User> = {
  q: "Jania",
  searchFields: ["firstName"],
  filter: { balance: 2000 },
  facets: ["lastName"],
};
```

## Update documents

The `update()` API is used to update existing documents that match the filters.
Fields that need to be updated are specified when calling the API.

In the following example, the field `balance` is updated for documents which
match the filter `id=1`.

```typescript
await users.update(
  {
    userId: 1,
  },
  {
    balance: 100, // set the balance of this user to 100
  },
  tx
);
```

## Delete documents

Use the `delete()` API to delete documents that match the filters.

```typescript
await users.delete({
  userId: user.userId,
});
```
