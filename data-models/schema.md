# Schema

We do not impose any restrictions on specific data models used by the developers to store the data. We aim to provide the best of both worlds: schema flexibility as seen in document models, while at the same time schema enforcement as seen in traditional relational models.

## Schema Enforcement

The applications that work with the data usually assume some kind of structure. Therefore, we do enforce schema on the data.&#x20;

We utilize the approach of schema-on-write which ensures that the schema is explicit and the database guarantees schema conformity of the data. Enforcing schema allows us to build powerful features such as Aggregations and Materialized Views, while also helping the developer to think about the data that is being stored.

## Schema Flexibility

We offer schema flexibility by having the ability to evolve the schema in a very lightweight manner. Documents with different schemas are allowed to co-exist and schema updates do not require a full table rebuild. Sparseness and support for hierarchical data are other key features.
