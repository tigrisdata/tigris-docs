---
id: replace
title: Replace
slug: /cli/replace
---

Inserts or replaces document(s)

### Synopsis

Inserts new documents or replaces existing documents.

```
tigris insert_or_replace {db} {collection} {document}...|- [flags]
```

### Examples

```

  # Insert new documents
  tigris insert_or_replace testdb users '{"id": 1, "name": "John Wong"}'

  # Replace existing document
  # Existing document with the following data will get replaced
  #  {"id": 20, "name": "Jania McGrory"}
  tigris insert_or_replace testdb users '{"id": 20, "name": "Alice Alan"}'

  # Insert or replace multiple documents
  # Existing document with the following data will get replaced
  #  {"id": 20, "name": "Alice Alan"}
  #  {"id": 21, "name": "Bunny Instone"}
  # While the new document {"id": 19, "name": "New User"} will get inserted
  tigris insert_or_replace testdb users \
  '[
    {"id": 19, "name": "New User"},
    {"id": 20, "name": "Replaced Alice Alan"},
    {"id": 21, "name": "Replaced Bunny Instone"}
  ]'

```

### Options

```
  -b, --batch_size int32   set batch size (default 100)
  -h, --help               help for replace
```
