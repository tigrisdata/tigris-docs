# Data Types

There are three categories of data types supported:&#x20;

* **Primitive**: Strings, Numbers, Binary Data, Booleans, UUIDs, Datetime
* **Complex:** Arrays, Sets, Maps
* **Objects**: A container data type defined by the user that stores fields of primitive types, complex types as well as other Objects

## Restrictions

For optimal performance and efficient data layout, there are restrictions on what data types can be used for primary key fields. The table below shows the details

| Type Name | Supported for Key Fields |
| --------- | ------------------------ |
| INT       | Yes                      |
| BIGINT    | Yes                      |
| DOUBLE    | No                       |
| BYTES     | Yes                      |
| STRING    | Yes                      |
| UUID      | Yes                      |
| DATETIME  | Yes                      |
| BOOL      | No                       |
| ARRAY     | No                       |
| SET       | No                       |
| MAP       | No                       |
| OBJECT    | No                       |
