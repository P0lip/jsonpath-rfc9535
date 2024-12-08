# jsonpath-rfc9535

A JSONPath implementation based on [RFC 9535](https://datatracker.ietf.org/doc/rfc9535/).

Works in any environment complying with ECMAScript 2022.

It passes the entire [JSONPath Compliance Test Suite](https://github.com/jsonpath-standard/jsonpath-compliance-test-suite) with 100% success rate (tested against commit 9277705).

If you are interested in a legacy specification, please check out my other package [nimma](https://github.com/P0lip/nimma).

## Installation

To install the package, you can use npm:

```sh
npm install jsonpath-rfc9535
```

or a package manager of your choice.

## Usage

```js
import { query } from 'jsonpath-rfc9535';

const document = {
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95,
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99,
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99,
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99,
      },
    ],
    "bicycle": {
      "color": "red",
      "price": 399,
    },
  },
};

const path = '$.store.book[*].author';
const result = query(document, path);

console.log(result); // Outputs: ['Nigel Rees', 'Evelyn Waugh', 'Herman Melville', 'J. R. R. Tolkien']
```

You can also import `exec` member that takes a callback.

```ts
import { exec } from 'jsonpath-rfc9535';

const document = {
  // ...
}

const path = '$.store.book[*].author';
const result = exec(document, path, (value) => {
  // consume matched value
});
```
## Parser

The parser is generated using [Peggy](https://peggyjs.org/). In the future, I would like to merge it with the Nimma's [parser](https://github.com/P0lip/nimma/blob/master/src/parser/parser.mjs) to shrink down the package size as well as improve the performance.

The parser can be imported as a standalone module:

```js
import parse from 'jsonpath-rfc9535/parser';

const ast = parse('$.store.book[*].author');
// consume ast
```

## Regular Expressions

Bear in mind that `match` and `search` functions accept regular expressions in the form of I-Regexp ([RFC 9485](https://datatracker.ietf.org/doc/rfc9485/)).
These regular expressions are largely compatible with the standard ECMAScript regular expressions, but there is one relatively minor difference.
In I-Regexp, the dot (.) character matches any character except for `\n` and `\r`.
On top of that, Unicode is enabled by default.

## Custom Function Extensions

At the moment, custom function extensions are not supported.
However, the API is designed to support them, so they might be added in the future if there is a demand for them.