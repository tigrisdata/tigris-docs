# Overview

TigrisDB is a document-oriented database with strict schema enforcement policies. Specifically, TigrisDB tries to maintain the flexibility of the document data modeling approach, while still enforcing schemas so that users can be confident in the integrity of their data.

## Core Concepts

### Database

A database is a group of collections.

### Collections

Collections are the core abstraction used by developers to model their entities.
Collections are analogous to tables or column families in other systems: they
represent an ordered set of structured records called documents that all follow
a specific schema and whose fields are strongly typed.

### Documents

Data records are stored as JSON documents. Documents are composed of
field-value pairs. The value of the field can be any of the JSON data types.

```json
{
  "field1": 1,
  "field2": "string",
  "field3": {
    "field1": "value1",
    "field2": "value2",
  },
  "field4": [
    {
      "field5": [{"field6": 100}]
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
