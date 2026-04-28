# @munesoft/isx

> **The last "is-\*" package you'll ever need.**

A tiny, fast, zero-dependency type-checking and validation library for JavaScript and TypeScript. Replace dozens of fragmented `is-*` micro-packages with one unified, tree-shakable utility.

[![npm](https://img.shields.io/npm/v/@munesoft/isx)](https://www.npmjs.com/package/@munesoft/isx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@munesoft/isx)](https://bundlephobia.com/package/@munesoft/isx)
[![license](https://img.shields.io/npm/l/@munesoft/isx)](./LICENSE)

---

## 🚀 Why isx?

The npm ecosystem has **hundreds** of tiny packages like `is-odd`, `is-array`, `is-number`, `is-plain-object`, and `kind-of`. They are:

- **Fragmented** — you need 10+ packages for basic type checking
- **Inconsistent** — each has its own API quirks
- **Inefficient** — dozens of `package.json` files, `node_modules` directories, and dependency trees to maintain

**isx** solves this with:

- ✅ A **unified API** — one import for everything
- ✅ **Zero dependencies** — nothing to audit or update
- ✅ **Optimized hot paths** — `typeof` first, tag-based fallback only when needed
- ✅ **Tree-shakable** — import only what you use
- ✅ **Universal** — Node.js and browsers

---

## 📦 Installation

```bash
npm install @munesoft/isx
```

---

## ⚡ Quick Start

```js
import is from '@munesoft/isx';

is.string('hello');      // true
is.number(123);          // true
is.array([1, 2, 3]);     // true
is.object({});           // true
is.plainObject({});      // true
is.odd(3);               // true
is.even(4);              // true
```

---

## 📖 API Reference

### Type Detection

```js
is.type(value)   // Returns type name as a string

is.type('hello')      // "string"
is.type(42)           // "number"
is.type(NaN)          // "nan"
is.type([])           // "array"
is.type({})           // "object"
is.type(new Date())   // "date"
is.type(new Map())    // "map"
is.type(null)         // "null"
```

### Primitives

```js
is.string(value)    // typeof value === 'string'
is.number(value)    // typeof value === 'number' && !isNaN(value)
is.boolean(value)   // typeof value === 'boolean'
is.symbol(value)    // typeof value === 'symbol'
is.bigint(value)    // typeof value === 'bigint'
is.primitive(value) // value !== Object(value)
```

### Numbers

```js
is.integer(10)     // true  — Math.floor(v) === v
is.float(1.5)      // true  — not an integer
is.odd(3)          // true  — bitwise fast path
is.even(4)         // true  — bitwise fast path
is.nan(NaN)        // true
is.positive(1)     // true
is.negative(-1)    // true
is.finite(1)       // true
is.infinite(Infinity) // true
is.safeInteger(42) // true
is.zero(0)         // true
```

### Objects

```js
is.object(value)       // non-null, typeof === 'object'
is.plainObject(value)  // {} or Object.create(null), no class instances
is.array(value)        // Array.isArray(value)
is.map(value)          // value instanceof Map
is.set(value)          // value instanceof Set
is.date(value)         // value instanceof Date && valid
is.regexp(value)       // value instanceof RegExp
is.error(value)        // value instanceof Error
is.promise(value)      // duck-typed .then check
is.iterable(value)     // has Symbol.iterator
```

### Object Helpers

```js
is.hasKey(obj, 'key')          // own property check
is.hasKeys(obj, ['a', 'b'])    // all own properties present
```

### Functions

```js
is.function(value)          // typeof === 'function'
is.asyncFunction(value)     // async function
is.generatorFunction(value) // function*
```

### Nil / Existence

```js
is.nil(value)        // null or undefined
is.null(value)       // strictly null
is.undefined(value)  // strictly undefined
is.defined(value)    // not undefined
is.truthy(value)     // !!value
is.falsy(value)      // !value
```

### Collections

```js
is.empty([])            // true
is.empty('')            // true
is.empty({})            // true
is.empty(new Map())     // true
is.notEmpty([1, 2])     // true
```

### Deep Equality

```js
is.deepEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }) // true
is.deepEqual(new Date('2024'), new Date('2024'))         // true
is.deepEqual(NaN, NaN)                                   // true
```

Uses an **iterative** algorithm (no recursion) — safe for deeply nested structures.

---

## 🔥 Advanced Features

### Functional Style

Wrap a value for method chaining:

```js
is('hello').string()   // true
is(42).number()        // true
is(3).odd()            // true
is([]).empty()         // true
```

### Assertion Mode

Throws a `TypeError` if the check fails:

```js
is.assert.string('hello')   // passes silently
is.assert.string(42)        // throws TypeError: expected string, got number
is.assert.integer(1.5)      // throws TypeError
```

Use in validation functions, constructors, or anywhere you want fail-fast behaviour.

### Schema Matching

Validate an object against a schema in one call:

```js
const result = is.match(user, {
  id:     'number',
  name:   'string',
  active: 'boolean',
});

result.valid   // true / false
result.errors  // string[] — one message per failing field
```

Schema rule types:

| Rule               | Behaviour                                |
|--------------------|------------------------------------------|
| `'string'`         | type name match via `is.type()`          |
| `'number'`         | same — works for all type names          |
| `Date` (constructor) | `instanceof Date`                      |
| `(v) => boolean`   | custom validator function                |
| `{ … }` (nested)   | deep sub-schema (requires `{ deep: true }`) |

```js
// Deep schema
is.match(data, {
  user: { id: 'number', name: 'string' },
}, { deep: true });

// Constructor rule
is.match({ createdAt: new Date() }, { createdAt: Date });

// Custom function rule
is.match({ age: 25 }, { age: (v) => v >= 18 });
```

### Reusable Schema Validators

```js
const validateUser = is.schema({
  id:   'number',
  name: 'string',
});

validateUser({ id: 1, name: 'Alice' })   // { valid: true, errors: [] }
validateUser({ id: 'oops' })             // { valid: false, errors: ['...'] }
```

### Custom Validators

Extend `is` with your own named checks:

```js
is.extend('email', (v) =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
);

is.email('user@example.com')    // true
is('bad').email()               // false
is.assert.email('user@example.com')  // passes
```

Custom validators are immediately available in:
- `is.name(value)`
- `is(value).name()`
- `is.assert.name(value)`
- `is.match(obj, { field: 'name' })` — via type string

### Strict Mode

In strict mode, `is.match` stops on the **first** failing field:

```js
is.strict(true);
is.match(value, schema);  // stops at first error

is.strict(false);         // reset
```

---

## 🌲 Tree-Shaking

Import only what you need for minimal bundle impact:

```js
// Full default import
import is from '@munesoft/isx';

// Named imports — works with any bundler (Rollup, Vite, esbuild, webpack 5)
import { isString, isNumber } from '@munesoft/isx';

// Sub-path imports
import { isOdd, isEven } from '@munesoft/isx/number';
import { isPlainObject } from '@munesoft/isx/object';
import { isString }      from '@munesoft/isx/string';
```

---

## 🆚 Comparison

| Feature             | `is-*` micro-packages | `@munesoft/isx` |
|---------------------|----------------------|-----------------|
| Unified API         | ❌ one package per check | ✅ everything in one |
| Zero dependencies   | ❌ chains of deps    | ✅ none          |
| Tree-shakable       | ❌ mostly not        | ✅ yes           |
| Deep equality       | ❌ separate package  | ✅ built-in      |
| Schema validation   | ❌ no                | ✅ built-in      |
| Assertion mode      | ❌ no                | ✅ built-in      |
| Custom validators   | ❌ no                | ✅ `is.extend()` |
| Functional style    | ❌ no                | ✅ `is(v).type()`|
| Browser + Node.js   | ⚠️ varies           | ✅ yes           |
| Performance         | ⚠️ varies           | ✅ optimized     |

---

## 🧪 Running Tests & Benchmarks

```bash
# Tests
npm test

# Benchmarks
npm run bench
```

---

## 🔍 Keywords

javascript type checking, is array javascript, is number nodejs, is odd javascript, is plain object, kind-of replacement, validation library js, type checker npm, unified type utils, tree shakable validation

---

## 📄 License

MIT © munesoft
