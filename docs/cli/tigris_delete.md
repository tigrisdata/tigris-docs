---
id: delete
title: Delete
slug: /cli/delete
---

Deletes document(s)

### Synopsis

Deletes documents according to the provided filter.

```
tigris delete {db} {collection} {filter} [flags]
```

### Examples

```

  # Delete a user where the value of the id field is 2
  tigris delete testdb users '{"id": 2}'

  # Delete users where the value of id field is 1 or 3
  tigris delete testdb users '{"$or": [{"id": 1}, {"id": 3}]}'

```

### Options

```
  -h, --help   help for delete
```
