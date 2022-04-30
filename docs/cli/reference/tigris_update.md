---
id: update
title: Update
slug: /cli/update
---

Updates document(s)

### Synopsis

Updates the field values in documents according to provided filter.

```
tigris update {db} {collection} {filter} {fields} [flags]
```

### Examples

```

  # Update the field "name" of user where the value of the id field is 2
  tigris update testdb users '{"id": 19}' '{"$set": {"name": "Updated New User"}}'

```

### Options

```
  -h, --help   help for update
```
