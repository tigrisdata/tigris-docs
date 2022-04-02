# Data Models

## **Overview**

We do not impose any restrictions on specific data models used by the developers to store the data. We aim to provide the best of both worlds: schema flexibility as seen in document models, while at the same time schema enforcement as seen in traditional relational models.

## Core Concepts

### Database

A database is a group of collections.

### **Collections**

Collection is the core entity which is used by developers to model their entities. A collection is analogous to a relational table - collection of structured records called documents that all follow a specific schema and data is strongly typed. Schema can evolve and a collection can have records with different schema versions.

### Documents

Data records are stored as JSON documents. Documents are composed of field-value pairs. The value of the field can be any of the JSON data types.

```json
{
   field1: 1,
   field2: "string",
   field3: { field1: value1, field2: value2 },
   ...
   fieldN: valueN
}
```

### Primary Key

Every collection must have a primary key. A primary key uniquely identifies a document in the collection and enforces the unique constraint. A primary key can be defined on a single field or can be composite. Documents are stored in sorted order according to the primary key.
