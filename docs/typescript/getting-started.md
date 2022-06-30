# Getting Started

![npm](https://img.shields.io/npm/v/@tigrisdata/core)

Tigris provides an easy-to-use and intuitive interface for TypeScript. Setting up
the database is instantaneous, as well - no need for tedious configuration.
You define the data model as part of the application code, which then drives
the database infrastructure without you having to configure and provision
database resources.

## Prerequisites

The Tigris client is compatible with Node version 12 onwards.

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
[data modeling](datamodel) section.

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
