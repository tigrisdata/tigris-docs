---
id: read
title: Read
slug: /cli/read
---

Reads and outputs documents

### Synopsis

Reads documents according to provided filter and fields.
If filter is not provided or an empty json document {} is passed as a filter, all documents in the collection are returned.
If fields are not provided or an empty json document {} is passed as fields, all the fields of the documents are selected.

```
tigris read {db} {collection} {filter} {fields} [flags]
```

### Examples

```

  # Read a user document where id is 20
  # The output would be
  #  {"id": 20, "name": "Jania McGrory"}
  tigris read testdb users '{"id": 20}'

  # Read user documents where id is 2 or 4
  # The output would be
  #  {"id": 2, "name": "Alice Wong"}
  #  {"id": 4, "name": "Jigar Joshi"}
  tigris read testdb users '{"$or": [{"id": 2}, {"id": 4}]}'

  # Read all documents in the user collection
  # The output would be
  #  {"id": 2, "name": "Alice Wong"}
  #  {"id": 4, "name": "Jigar Joshi"}
  #  {"id": 20, "name": "Jania McGrory"}
  #  {"id": 21, "name": "Bunny Instone"}
  tigris read testdb users

```

### Options

```
  -h, --help   help for read
```
