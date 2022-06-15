# Client Library: TypeScript

![npm](https://img.shields.io/npm/v/@tigrisdata/core)

Tigris provides an easy-to-use and intuitive interface for TypeScript for Node
environment.

You define the data model as part of the application code, which then drives the
database infrastructure without you having to configure and provision database
resources.

## Prerequisites

The Tigris client is compatible on Node version 12 onwards.

## Installation

```shell
npm install @tigrisdata/core
```

## Set up the data model

Tigris client uses interface for data container and developers define the schema
of their data container using TigrisSchema

```typescript title=DataContainer
interface User extends TigrisCollectionType {
  userId?: number;
  name: string;
  balance: number;
}
```

```typescript title=SchemaDefinition
const userSchema: TigrisSchema<User> = {
  userId: {
    type: TigrisDataTypes.INT32,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  name: {
    type: TigrisDataTypes.STRING,
  },
  balance: {
    type: TigrisDataTypes.NUMBER,
  },
};
```

For detailed documentation on schema representation refer to the
[data modeling using TypeScript](../datamodels/using-typescript.md) section.

## Connect and initialize the database

Configure Tigris client using configuration.

```typescript
const tigris: Tigris = new Tigris({
  serverUrl: "localhost:8081",
});
```

Create database (if not exists)

```typescript
const db: Database = await tigris.createDatabaseIfNotExists("hello-db");
```

Create collection

```typescript
const users: Collection<User> = await db.createOrUpdateCollection(
  "users",
  userSchema
);
```

## CRUD operations

The first step is to set up the collection object. All the CRUD operations on
the collection are performed through this collection object.

```typescript
const users: Collection<User> = db.getCollection<User>("users");
```

### Insert documents

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

### Upsert documents

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

### Read single document

To read one document you can use `readOne()`, If filters are provided, then
documents matching the filtering condition are fetched.

```typescript
const user: User = await users.readOne({
  userId: 1,
});
```

#### Read documents

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

### Update documents

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

### Delete documents

Use the `delete()` API to delete documents that match the filters.

```typescript
await users.delete({
  userId: user.userId,
});
```

## Transactions

Tigris provides global, ACID transactions with strict serializability using
optimistic concurrency control. The transactions allow multiple clients to
concurrently read and write data in the database with strong consistency
guarantees.

Transactions in Tigris work across collections and documents without any
restrictions. Unlike some other document databases, there are no confusing read
/ write concerns to configure, and no cross-shard caveats.

```typescript
await db.transact(async (tx) => {
  // read user 1
  const user1: User | undefined = await users.readOne(
    {
      userId: 1,
    },
    tx
  );

  // read user 2
  const user2: User | undefined = await users.readOne(
    {
      userId: 2,
    },
    tx
  );

  if (user1 === undefined || users2 === undefined) {
    throw new Error("User(s) not found"); // This will auto-rollback transaction
  }

  // deduct balance from user1
  await users.update(
    {
      userId: user1.userId,
    },
    {
      balance: user1.balance - 100,
    },
    tx
  );

  // add balance to user2
  await users.update(
    {
      userId: user2.userId,
    },
    {
      balance: user2.balance + 100,
    },
    tx
  );
});
```

## Drop database

```typescript
await tigris.dropDatabase("hello-db");
```
