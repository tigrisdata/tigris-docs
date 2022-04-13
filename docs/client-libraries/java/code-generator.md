# Java: Code Generators

![Maven Central](https://img.shields.io/maven-central/v/com.tigrisdata.tools.code-generator/maven-plugin)

TigrisDB code generator reads collection schema files and generates Java
models and enables access via models in the client library. code generator
is offered via maven-plugin and CLI.

Below is the maven build configuration

```xml

<build>
    <plugins>
        ...
        <plugin>
            <groupId>com.tigrisdata.tools.code-generator</groupId>
            <artifactId>maven-plugin</artifactId>
            <!-- we are still pre-release -->
            <version>1.0.0-alpha.2</version>
            <executions>
                <execution>
                    <goals>
                        <goal>generate-sources</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!-- directory location of schema files -->
                <!-- default schemaDir=${project.basedir}/src/main/resources/tigrisdb-schema-->
                <schemaDir>src/main/resources/tigrisdb-schema</schemaDir>
                <!-- Java model's package name -->
                <!-- required field -->
                <packageName>com.tigrisdata.store.generated</packageName>
                <!-- Output directory where Java classes will be generated -->
                <!-- default outputDirectory=${project.basedir}/target/generated-sources -->
                <outputDirectory>target/generated-sources</outputDirectory>
                <!-- Disables schema compatibility validation -->
                <!-- default disableValidation=false -->
                <disableValidation>false</disableValidation>
            </configuration>
        </plugin>
        ...
    </plugins>
</build>
```

Example schema

```json
{
  "name": "users",
  "description": "Collection of documents with details of users",
  "properties": {
    "id": {
      "description": "A unique identifier for the user",
      "type": "integer"
    },
    "name": {
      "description": "Name of the user",
      "type": "string"
    },
    "balance": {
      "description": "User account balance",
      "type": "number"
    }
  },
  "primary_key": ["id"]
}
```

The generated Java model looks like

```java

/**
 * Collection of documents with details of users
 *
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "name",
        "balance"
})
@Generated("tigrisdb-model-generator")
public class User implements TigrisCollectionType
{

    /**
     * A unique identifier for the user
     *
     */
    @JsonProperty("id")
    @JsonPropertyDescription("A unique identifier for the user")
    private int id;
    /**
     * Name of the user
     *
     */
    @JsonProperty("name")
    @JsonPropertyDescription("Name of the user")
    private String name;
    /**
     * User account balance
     *
     */
    @JsonProperty("balance")
    @JsonPropertyDescription("User account balance")
    private double balance;

    /**
     * A unique identifier for the user
     *
     */
    @JsonProperty("id")
    public int getId() {
        return id;
    }

    /**
     * A unique identifier for the user
     *
     */
    @JsonProperty("id")
    public void setId(int id) {
        this.id = id;
    }

    public User withId(int id) {
        this.id = id;
        return this;
    }

    /**
     * Name of the user
     *
     */
    @JsonProperty("name")
    public String getName() {
        return name;
    }

    /**
     * Name of the user
     *
     */
    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    public User withName(String name) {
        this.name = name;
        return this;
    }

    /**
     * User account balance
     *
     */
    @JsonProperty("balance")
    public double getBalance() {
        return balance;
    }

    /**
     * User account balance
     *
     */
    @JsonProperty("balance")
    public void setBalance(double balance) {
        this.balance = balance;
    }

    public User withBalance(double balance) {
        this.balance = balance;
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(User.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("id");
        sb.append('=');
        sb.append(this.id);
        sb.append(',');
        sb.append("name");
        sb.append('=');
        sb.append(((this.name == null)?"<null>":this.name));
        sb.append(',');
        sb.append("balance");
        sb.append('=');
        sb.append(this.balance);
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Override
    public int hashCode() {
        int result = 1;
        result = ((result* 31)+((this.name == null)? 0 :this.name.hashCode()));
        result = ((result* 31)+ this.id);
        result = ((result* 31)+((int)(Double.doubleToLongBits(this.balance)^(Double.doubleToLongBits(this.balance)>>> 32))));
        return result;
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }
        if ((other instanceof User) == false) {
            return false;
        }
        User rhs = ((User) other);
        return ((((this.name == rhs.name)||((this.name!= null)&&this.name.equals(rhs.name)))&&(this.id == rhs.id))&&(Double.doubleToLongBits(this.balance) == Double.doubleToLongBits(rhs.balance)));
    }

}
```
