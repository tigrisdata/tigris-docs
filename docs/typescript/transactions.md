# Transactions

Tigris provides global, ACID transactions with strict serializability
using optimistic concurrency control. The transactions allow multiple
clients to concurrently read and write data in the database with strong
consistency guarantees.

Transactions in Tigris work across collections and documents without any
restrictions. Unlike some other document databases, there are no confusing
read or write concerns to configure, and no cross-shard caveats.

```typescript
await db.transact(async (tx) => {
  // read user 1
  const user1: User | undefined = await users.findOne(
    {
      userId: 1,
    },
    tx
  );

  // read user 2
  const user2: User | undefined = await users.findOne(
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
