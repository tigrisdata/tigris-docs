# Working Locally

Getting started working with Tigris locally requires one easy step.

### Starting up local Tigris

Open your terminal, and:

```shell
tigris local up
```

This will spin up Tigris locally as a set of Docker containers. The Tigris
server will then be available on port `8081`.

### Health Check

You can use the `ping` command to verify that the server is ready to
accept requests.

```shell
tigris ping
```

### Start building

That's it, you are ready to build with Tigris!

```shell
tigris create database testdb
tigris create collection testdb \
'{
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
tigris insert_or_replace testdb users '{"id": 20, "name": "Alice Alan"}'
tigris read testdb users
```

### Shutting down the local Tigris

Shutting down the locally running Tigris is also as easy as requiring a
single step. Open your terminal, and:

```shell
tigris local down
```

### Customizing the Tigris server version and port

You can change the Tigris server port. For example, if you want
the server to be available on port `9091`:

```shell
tigris local up 9091
```

By default, the
[Docker image](https://hub.docker.com/repository/docker/tigrisdata/tigris/tags)
corresponding to the latest released version is used to spin up Tigris. If
you want to run a specific version, such as `1.0.0-alpha.13`:

```shell
tigris local up 8081 1.0.0-alpha.13
```
