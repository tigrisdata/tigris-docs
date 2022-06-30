# Getting Started

[![Maven Central](https://img.shields.io/maven-central/v/com.tigrisdata/tigris-client-java)](https://mvnrepository.com/artifact/com.tigrisdata/tigris-client)
[![javadoc](https://javadoc.io/badge2/com.tigrisdata/tigris-client/javadoc.svg)](https://javadoc.io/doc/com.tigrisdata/tigris-client)

Tigris provides an easy-to-use and intuitive interface for Java. Setting up
the database is instantaneous, as well - no need for tedious configuration.
You define the data model as part of the application code, which then drives
the database infrastructure without you having to configure and provision
database resources.

The Tigris Java client libraries offer both [asynchronous](async-client) and
[synchronous](sync-client) clients.

The asynchronous client provides non-blocking, asynchronous APIs for
interacting with Tigris. These APIs let you use the SDK to build scalable
applications that use system resources in an efficient way.

While the synchronous clients cater to a wider audience, and also make the
client libraries approachable for users not familiar with asynchronous
programming.

:::info

We recommend using the asynchronous clients for production systems to
maximize the use of system resources.

:::

## Installation

Follow the instructions
[here](https://mvnrepository.com/artifact/com.tigrisdata/tigris-client) for your
build tool of choice and add the client library to your project.

```java
import com.tigrisdata.db.client.*;
import com.tigrisdata.db.annotation.*;
import com.tigrisdata.db.type.*;
```

## In this section

The following documentation pages provide details about the functionality
provided by the Java client libraries.
