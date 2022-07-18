# Declaring Models

There are two basic constructs for TypeScript Tigris modeling.

1. Data containers - interface that holds the data model
2. Schema of Data containers - TigrisSchema definition of these data containers.

```typescript
// data container
interface User extends TigrisCollectionType {
  userId?: number;
  firstName: string;
  lastName: string;
  balance: number;
}

// schema definition
const userSchema: TigrisSchema<User> = {
  userId: {
    type: TigrisDataTypes.INT32,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  firstName: {
    type: TigrisDataTypes.STRING,
  },
  lastName: {
    type: TigrisDataTypes.STRING,
  },
  balance: {
    type: TigrisDataTypes.NUMBER,
  },
};
```

:::info

- You must keep the data container and schema definition in sync.
- The primary key field is marked as autoGenerate=true which is why it
  is defined as an optional field.

:::
