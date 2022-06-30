# Data Modeling

Most applications expect the data they store to conform to some kind of
schema. A schema is a blueprint for the application that outlines how data
should be structured. More importantly, schemas make data more accessible and
less prone to errors, making them an essential part of application architecture.

For Tigris, schemas are an integral part and form the basis for our declarative
approach to database infrastructure.

Tigris enforces that all documents stored in a collection conform to the
collection's schema.

:::tip
We offer schema flexibility by having the ability to evolve the schema in a
very lightweight manner. Documents with different schemas are allowed to
co-exist. Schema changes are instant and do not require a full table rebuild.

:::

## Data Types

There are three categories of data types supported:

- **Primitive**: Strings, Numbers, Binary Data, Booleans, UUIDs, DateTime
- **Complex:** Arrays
- **Objects**: A container data type defined by the user that stores fields
  of primitive types, complex types as well as other Objects

## Defining the Data Models

The data models encompassing collections and their schema are declared
as part of the application code using the same programming language. By
incorporating this data model into your application code, you can ensure
that it remains consistent and up-to-date with the application's business logic.

The language specific reference sections cover defining the data models and
schemas in the supported programming languages.
