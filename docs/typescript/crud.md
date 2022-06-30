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
  name: "Jania McGrory",
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
  name: "Bunny Instone",
});
```

## Read single document

To read one document you can use `readOne()`, If filters are provided, then
documents matching the filtering condition are fetched.

```typescript
const user: User = await users.readOne({
  userId: 1,
});
```

### Read documents

To read multiple documents, use the `read()` API.

```typescript
users.read(
  {
    op: LogicalOperator.OR,
    selectorFilters: [
      {
        name: "alice",
      },
      {
        name: "emma",
      },
    ],
  },
  {
    onEnd() {
      // when read is finished
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
