---
id: intro
slug: /
---

# Introduction

## What is TigrisDB?

[TigrisDB](https://github.com/tigrisdata/tigrisdb) is an open-source, zero-ops, globally
distributed NoSQL database for real-time websites and apps.

We are fully committed to open source and embrace the open exchange of
information, collaborative development and transparency.

TigrisDB is permissively licensed under the terms of the
[Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0)

## How is TigrisDB different from other databases?

There are a lot of things that distinguish Tigris from other databases, but the primary one is a relentless focus on a seamless user experience. Specifically, TigrisDB prioritizes reliability and correctness over everything else. Performance is important to us too, but we care more about building a database that never wakes you up in the middle of the night than winning synthetic benchmarks.

### Old Meets New: Built On a Strong Foundation

The first thing that distinguishes TigrisDB from other modern distributed databases is that it's built on top of one of the most reliable and battle-tested storage technologies ever created: FoundationDB (FDB). The FoundationDB [documentation](https://apple.github.io/foundationdb/testing.html) and [paper](https://www.foundationdb.org/files/fdb-paper.pdf) go into more detail, but the short of it is that FDB was designed from the ground up around the idea of continuous "simulation testing". While most other distributed databases might get subjected to a proper [Jepsen](https://jepsen.io/analyses) test once or twice in their entire lifetime, FoundationDB is subjected to significantly more strenous testing every night. Suffice it to say that there is a reason companies like Apple and Snowflake use FoundationDB to store their most critical data.

### Consistency Model

Every Tigris operation runs within a transaction. Transactions are interactive (meaning you can control when they begin and end in your application code), and always run with a "strictly serializable" isolation guarantee. This is the highest possible isolation model that a database can provide, and it means that Tigris transactions will always appear to execute **as if** you executed them back-to-back in a single-threaded manner.

For more details, check out our [consistency model](./concepts/consistency_model.md) section.
