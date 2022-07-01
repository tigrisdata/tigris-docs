# Supported Go Types

Tigris supports the majority of the basic Go types while also providing support
for custom types.

- Basic types: int, int32, int64, float32, float64, string, []string, byte,
  []byte, bool, map[string], time.Time, uuid.UUID
- Custom types: struct to define custom types

## Field Tags

Tags can be used in the struct definition to enrich the fields when
declaring the models.

| Tag Name              | Description                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| json                  | Customize the struct fields when the model is converted into collection schema. Primarily used for transforming the struct field names as they get converted to collection schema |
| tigris:"primaryKey"   | Specify the field that will be used as the primary key. Optionally specify a number, for example `tigris:"primaryKey:1"`, to define the field order in a composite primary key    |
| tigris:"autoGenerate" | Specify that Tigris should autogenerate the values for this field. This can be combined with the primaryKey tag                                                                   |
