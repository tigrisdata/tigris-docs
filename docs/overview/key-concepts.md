# Key Concepts

Tigris is a modern, scalable backend for building real-time websites and apps.
The zero-ops approach of Tigris means you can focus on your application rather
than managing databases or data pipelines. Our simple APIs makes it
easy to get started with any data architecture needs!

The key concepts in this document will help you get started with
understanding how it works and help you develop a mental model on how to
build an application with Tigris.

| Concept         | Description                                                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Database**    | A group of collections.                                                                                                                                                                               |
| **Collection**  | An ordered set of structured records called documents- analogous to tables in other database systems.                                                                                                 |
| **Schema**      | A user-defined structure for the documents in a collection specified using JSON schema [specification](https://json-schema.org/specification.html).                                                   |
| **Document**    | A JSON object with a pre-defined schema.                                                                                                                                                              |
| **Primary Key** | A primary key uniquely identifies a document in the collection and enforces the unique constraint.                                                                                                    |
| **Transaction** | Global ACID transactions with strict serializability using optimistic concurrency that allow multiple clients to concurrently read and write data in the database with strong consistency guarantees. |
| **Stream**      | Real-time events for writes performed on collections.                                                                                                                                                 |

### Database

A database is a group of one or many collections.

### Collection

Collections are the core abstraction used by developers to model their entities.
Collections are analogous to tables or column families in other systems; they
represent an ordered set of structured records called documents that all follow
a specific schema and whose fields are strongly typed.

### Schema

A schema defines all the fields that make up the document in a collection. All
documents stored in a collection must conform to the collection's schema
that follows JSON schema
[specification](https://json-schema.org/specification.html). Since schemas
are a way to structure your data according to the application logic, they
are described as part of your application code using its programming language
constructs.

### Document

Data records are stored as JSON documents. Documents are composed of
field-value pairs. The value of the field can be any of the JSON data types.

```json
{
  "field1": 1,
  "field2": "string",
  "field3": {
    "field1": "value1",
    "field2": "value2"
  },
  "field4": [
    {
      "field5": [{ "field6": 100 }]
    }
  ],
  "fieldN": "valueN"
}
```

### Primary Key

Every collection must have a primary key. A primary key uniquely identifies
a document in the collection and enforces the unique constraint. A primary
key can be defined on a single field or can be composite. Documents are
stored in sorted order according to the primary key.

### Transaction

Transactions allow multiple clients to concurrently read and write data in
the database with strong consistency guarantees. Transactions are globally
ordered and ACID compliant with strict serializability using optimistic
concurrency control.

Transactions work across collections and documents without any
restrictions. Unlike some other document databases, there are no confusing
read / write concerns to configure, and no cross-shard caveats.

### Stream

Streams provide a continuous ordered stream of events in real-time for all
the writes performed in the collection. The event stream can then be used
for building real-time applications such as IoT platform, messaging app,
monitoring, analytics and others.
