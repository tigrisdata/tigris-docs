---
id: generate-sample-schema
title: Generate Sample Schema
slug: /cli/generate-sample-schema
---

Generates sample schema

### Synopsis

Generates sample schema consisting of three collections: products, users, orders.

```
tigris generate sample-schema [flags]
```

### Examples

```

  # Generate sample schema files in current directory orders.json, products.json and users.json
  tigris generate sample-schema

  # Create the database sampledb and sample collections
  tigris generate sample-schema --create

  # Generate sample schema and output it to stdout
  tigris generate sample-schema --stdout

```

### Options

```
  -c, --create   create the sample database and collections
  -h, --help     help for sample-schema
  -s, --stdout   dump sample schemas to stdout
```
