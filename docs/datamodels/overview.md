# Overview

TigrisDB is a document-oriented database with flexible data modeling capabilities and configurable schema enforcement policies. Specifically, TigrisDB tries to maintain the flexibility of document models while still supporting strict schema enforcement for applications that need it.

## Core Concepts

### Database

A database is a group of collections.

### Collections

A collection is the core entity which is used by developers to model their
entities. A collection is analogous to a table in other systems - a collection of
structured records called documents that all follow a specific schema and
whose fields are strongly typed.

### Documents

Data records are stored as JSON documents. Documents are composed of
field-value pairs. The value of the field can be any of the JSON data types.

```json
{
  "field1": 1,
  "field2": "string",
  "field3": { "field1": "value1", "field2": "value2" },
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
