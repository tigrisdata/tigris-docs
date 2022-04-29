---
id: insert
title: Insert
slug: /cli/insert
---

Inserts document(s)

### Synopsis

Inserts one or more documents into a collection.

```
tigris insert {db} {collection} {document}...|- [flags]
```

### Examples

```

  # Insert a single document into the users collection
  tigris insert testdb users '{"id": 1, "name": "Alice Alan"}'

  # Insert multiple documents into the users collection
  tigris insert testdb users \
  '[
    {"id": 20, "name": "Jania McGrory"},
    {"id": 21, "name": "Bunny Instone"}
  ]'

  # Pass documents to insert via stdin
  # $ cat /home/alice/user_records.json
  # [
  #  {"id": 20, "name": "Jania McGrory"},
  #  {"id": 21, "name": "Bunny Instone"}
  # ]
  cat /home/alice/user_records.json | tigris insert testdb users -

```
