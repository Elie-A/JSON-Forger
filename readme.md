# JSON Forger

This script is a JSON file generator based on a custom json schema

## Installation

- Clone the repository to your local machine.
- Install dependencies by running npm install.

## Library Usage

- Execute this command to install the library `npm i json-forger`

```
// Method 01:
import { JsonGenerator, readAndSaveSchema } from "json-forger";

const generator = new JsonGenerator();

const schema = await readAndSaveSchema("schema.json");
console.log(generator.generateJsonFromSchema(schema));


// Method 02:
const { JsonGenerator, readAndSaveSchema } = require("json-forger");

(async () => {
  const generator = new JsonGenerator();
  const schema = await readAndSaveSchema("schema.json");
  console.log(generator.generateJsonFromSchema(schema));
})();

```

- Information about the functions
  - `readAndSaveSchema` This function, parses the JSON schema file from a given file path, parses its contents into a JavaScript object, and returns the parsed object. If there's an error during this process, it catches the error, logs it, and returns null.
  - `generateJsonFromSchema` This function, generateJsonFromSchema, takes a propertySchema object and an array of propertyPath as input and generates JSON data based on the schema provided. Let's break down how it works:
    - `Destructuring:` The function destructures properties from the propertySchema object such as type, format, pattern, enum, useDefault, default, minimum, maximum, minLength, maxLength, length, items, properties, and countryCode.
    - `Switch Statement:` The function checks the type property of the propertySchema object using a switch statement.
    - `Case Handling:`
      - `Integer:` Generates a random integer within a specified range (if provided) or uses a default value.
      - `String:` Generates a random string based on different conditions like format, pattern, enum values, length, etc. Handles cases for phone numbers specifically if format is 'phone' and countryCode is provided (_country code examples: US, FR, LB, NO, etc._)
      - `Object:` Calls a function generateObjectData to generate data for nested objects.
      - `Array:` Calls a function generateArrayData to generate data for arrays.
      - `Boolean:` Generates a random boolean value.
      - `Date:` Generates a random date. It considers format and default value if provided. The supported formats are: _"YYYY-MM-DD", "YYYY/MM/DD", "YYYY-MMM-DD", "YYYY/MMM/DD", "DD-MM-YYYY", "DD/MMM/YYYY", "DD-MMM-YYYY", "DD/MMM/YYYY"_
      - `Default:` Returns the default value or null if none specified.
    - `Return Values:` The function returns the generated value based on the type of the property defined in the schema.

## Contributing

Contributions to the JSON Generator are welcome! Here are some ways you can contribute:

- Submit bug reports or feature requests by opening an issue.
- Fork the repository and submit pull requests for bug fixes or new features.
- Improve documentation or README.

## Example

- Json Schema Template

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "user": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "username": { "type": "string", "pattern": "^[A-Za-z]{3,16}$" },
          "email": { "type": "string", "format": "email", "default": "default@mail.com", "useDefault": false},
          "work_email": { "type": "string", "format": "email", "default": "defaultWork@mail.com", "useDefault": true},
          "phone_number": {"type": "string", "format": "phone"},
          "profile": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "length": 5 },
              "age": { "type": "integer", "minimum": 18, "maximum": 150 },
              "city": { "type": "string", "length": 20 },
              "dob": {"type": "date", "format": "YYYY-MMM-DD", "default": "1999-01-01", "useDefault": false}
            }
          }
        }
      }
    },
    "required": ["user"]
  }
```

- Result

```
{
      "user": {
        "id": 4576033970402622,
        "username": "KZaLLwiCjom",
        "email": "vi3Vh9CL@example.com",
        "work_email": "defaultWork@mail.com",
        "phone_number": "+33 (02) 00 14 23 07",
        "profile": {
          "name": "uJKdi",
          "age": 48,
          "city": "2lBJTXQxl5KtNCD8hm7s",
          "dob": "1958-Feb-02"
        }
      }
}
```
