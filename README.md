[![Code Style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# docs.tigrisdata.com

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern
static website generator.

## Prerequisites

[Node.js](https://nodejs.org/en/download/) version >= 14 or above (which can
be checked by running node -v).

### Protocol Buffer Compiler

Install protoc. Change for your OS as necessary

```shell
brew install protobuf
```

Install protoc-gen-doc. This depends on golang.

```shell
go install github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc@latest
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

## Updating API documentation

[tigris-api](https://github.com/tigrisdata/tigris-api) is included as a
submodule. After updating the submodule to pull in new proto changes, the
documentation can be updated using the following steps:

```shell
protoc --doc_out=./fixtures --doc_opt=json,proto_workspace.json --proto_path=external/tigris-api/ server/v1/api.proto
npx docusaurus generate-proto-docs
```

# # Code Quality

## 1. Linting

The coding style rules are defined by [Prettier](https://prettier.io/) and
enforced by [Eslint](https://eslint.org)

## 2. Git Hooks

We use [pre-commit](https://pre-commit.com/index.html) to automatically
setup and run git hooks.

On every `git commit` we check the code quality using prettier and eslint.
