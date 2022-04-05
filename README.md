# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern 
static website generator.

## Prerequisites

[Node.js](https://nodejs.org/en/download/) version >= 14 or above (which can 
be checked by running node -v).

### Protobuffet

Install protoc. change for your OS as necessary

```shell
brew install protobuf
```

Install protoc-gen-doc. this depends on golang.

```shell
go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc
```

## Installation

```shell
npm install
```

## Local development

```shell
npm run start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

## Build

```shell
npm run build
```

This command generates static content into the `build` directory and can be 
served using any static contents hosting service.

## Updating Proto documentation

[tigrisdb-api](https://github.com/tigrisdata/tigrisdb-api) is included as a 
submodule. After updating the submodule to pull in new proto changes, the 
documentation can be updated using the following steps:

```shell
protoc --doc_out=./fixtures --doc_opt=json,proto_workspace.json --proto_path=external/tigrisdb-api/ server/v1/api.proto
```
