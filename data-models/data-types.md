# Data Types

There are three categories of data types supported:&#x20;

* **Primitive**: Strings, Numbers, Binary Data, Booleans, UUIDs, DateTime
* **Complex:** Arrays, Sets, Maps
* **Objects**: A container data type defined by the user that stores fields of primitive types, complex types as well as other Objects

{% hint style="info" %}
For optimal performance and efficient data layout, there are restrictions on what data types can be used for primary key fields.
{% endhint %}

| Type Name | Description | Supported for Key Fields |
| --------- | ----------- | ------------------------ |
| int       |             | Yes                      |
| bigint    |             | Yes                      |
| double    |             | No                       |
| bytes     |             | Yes                      |
| string    |             | Yes                      |
| uuid      |             | Yes                      |
| datetime  |             | Yes                      |
| bool      |             | No                       |
| array     |             | No                       |
| object    |             | No                       |

