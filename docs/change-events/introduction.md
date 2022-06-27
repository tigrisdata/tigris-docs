# Introduction

Each operation of a transaction is recorded as a change event. You can stream these change events per collection in
real-time. The table below describes the fields of the JSON for each change event.

| Field          | Description                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **tx_id**      | Unique id shared by all operations of a transaction.                                             |
| **collection** | Name of the collection the change applies to.                                                    |
| **op**         | Operation type, one of: `insert`, `replace`, `update`, `updateRange`, `delete` or `deleteRange`. |
| **data**       | Document data for operations of `insert`, `replace` or `update`.                                 |
| **last**       | Boolean that determines if this was the last operation in the transaction.                       |
