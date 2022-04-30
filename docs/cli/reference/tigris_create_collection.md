---
id: create-collection
title: Create Collection
slug: /cli/create-collection
---

Creates collection(s)

### Synopsis

Creates collections with provided schema.

```
tigris create collection {db} {schema}...|- [flags]
```

### Examples

```

  # Pass the schema as a string
  tigris create collection testdb '{
	"title": "users",
	"description": "Collection of documents with details of users",
	"properties": {
	  "id": {
		"description": "A unique identifier for the user",
		"type": "integer"
	  },
	  "name": {
		"description": "Name of the user",
		"type": "string",
		"maxLength": 100
	  }
	},
	"primary_key": [
	  "id"
	]
  }'

  # Create collection with schema from a file
  # $ cat /home/alice/users.json
  # {
  #  "title": "users",
  #  "description": "Collection of documents with details of users",
  #  "properties": {
  #    "id": {
  #      "description": "A unique identifier for the user",
  #      "type": "integer"
  #    },
  #    "name": {
  #      "description": "Name of the user",
  #      "type": "string",
  #      "maxLength": 100
  #    }
  #  },
  #  "primary_key": [
  #    "id"
  #  ]
  # }
  tigris create collection testdb </home/alice/users.json

  # Create collection with schema passed through stdin
  cat /home/alice/users.json | tigris create collection testdb -
  tigris describe collection sampledb users | jq .schema | tigris create collection testdb -

```

### Options

```
  -h, --help   help for collection
```
