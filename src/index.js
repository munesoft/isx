/**
 * @munesoft/isx
 * Tiny, fast, unified type-checking and validation utility.
 * Zero dependencies. Tree-shakable. Works in Node.js and browsers.
 *
 * @example
 * import is from '@munesoft/isx';
 * is.string('hello');   // true
 * is.odd(3);            // true
 * is('hi').string();    // true  (functional style)
 */

import { typeOf }                          from './core/typeOf.js';
import { deepEqual }                       from './utils/deepEqual.js';
import { match as _match, schema as _schema } from './core/schema.js';
import { isString }                        from './checks/string.js';
import {
  isNumber, isNaN_ as isNaN, isInteger, isFloat,
  isOdd, isEven, isPositive, isNegative,
  isFiniteNumber, isInfinite, isSafeInteger, isZero,
} from './checks/number.js';
import {
  isObject, isPlainObject, isArray, isMap, isSet,
  isWeakMap, isWeakSet, isDate, isRegExp, isError,
  isPromise, hasKey, hasKeys,
} from './checks/object.js';
import {
  isNil, isNull, isUndefined, isDefined,
  isTruthy, isFalsy, isBoolean, isFunction,
  isSymbol, isBigInt, isPrimitive, isIterable,
  isAsyncFunction, isGeneratorFunction,
  isEmpty, isNotEmpty,
} from './checks/misc.js';

// ---------------------------------------------------------------------------
// Custom validator registry
// ---------------------------------------------------------------------------
const _custom = Object.create(null);
let _strictMode = false;

// ---------------------------------------------------------------------------
// Assertion helpers
// ---------------------------------------------------------------------------
function _assert(name, checkFn, value) {
  if (!checkFn(value)) {
    throw new TypeError(
      `[isx] Assertion failed: expected value to be ${name}, got ${typeOf(value)} (${String(value)})`
    );
  }
}

// Build assert proxy lazily so it reflects custom validators
function _buildAssert() {
  return new Proxy(Object.create(null), {
    get(_, name) {
      const fn = _is[name];
      if (typeof fn !== 'function') {
        throw new ReferenceError(`[isx] assert.${name} is not a check function`);
      }
      return (value) => _assert(name, fn, value);
    },
  });
}

// ---------------------------------------------------------------------------
// Functional wrapper  is(value).string()
// ---------------------------------------------------------------------------
function _wrap(value) {
  const proxy = new Proxy(Object.create(null), {
    get(_, name) {
      const fn = _is[name];
      if (typeof fn !== 'function') return undefined;
      return () => fn(value);
    },
  });
  return proxy;
}

// ---------------------------------------------------------------------------
// Core `is` object
// ---------------------------------------------------------------------------
const _is = {
  // ── Primitives ──────────────────────────────────────────────────────────
  string:   isString,
  number:   isNumber,
  boolean:  isBoolean,
  symbol:   isSymbol,
  bigint:   isBigInt,
  primitive: isPrimitive,

  // ── Nil / existence ──────────────────────────────────────────────────────
  nil:       isNil,
  null:      isNull,
  undefined: isUndefined,
  defined:   isDefined,
  truthy:    isTruthy,
  falsy:     isFalsy,

  // ── Numbers ──────────────────────────────────────────────────────────────
  nan:         isNaN,
  integer:     isInteger,
  float:       isFloat,
  odd:         isOdd,
  even:        isEven,
  positive:    isPositive,
  negative:    isNegative,
  finite:      isFiniteNumber,
  infinite:    isInfinite,
  safeInteger: isSafeInteger,
  zero:        isZero,

  // ── Objects ───────────────────────────────────────────────────────────────
  object:      isObject,
  plainObject: isPlainObject,
  array:       isArray,
  map:         isMap,
  set:         isSet,
  weakMap:     isWeakMap,
  weakSet:     isWeakSet,
  date:        isDate,
  regexp:      isRegExp,
  error:       isError,
  promise:     isPromise,
  iterable:    isIterable,

  // ── Functions ─────────────────────────────────────────────────────────────
  function:          isFunction,
  asyncFunction:     isAsyncFunction,
  generatorFunction: isGeneratorFunction,

  // ── Collections ───────────────────────────────────────────────────────────
  empty:    isEmpty,
  notEmpty: isNotEmpty,

  // ── Object helpers ────────────────────────────────────────────────────────
  hasKey,
  hasKeys,

  // ── Type detection ────────────────────────────────────────────────────────
  type: typeOf,

  // ── Equality ─────────────────────────────────────────────────────────────
  deepEqual,

  // ── Schema / match ────────────────────────────────────────────────────────
  /**
   * Validate a value against a schema.
   * @param {*} value
   * @param {Object} schemaDef
   * @param {{ deep?: boolean, strict?: boolean }} [opts]
   */
  match(value, schemaDef, opts = {}) {
    return _match(value, schemaDef, { strict: _strictMode, ...opts });
  },

  /**
   * Build a reusable schema validator function.
   * @param {Object} schemaDef
   * @param {{ deep?: boolean }} [opts]
   */
  schema(schemaDef, opts = {}) {
    return _schema(schemaDef, opts);
  },

  // ── Custom validators ─────────────────────────────────────────────────────
  /**
   * Register a custom check.
   * @param {string} name
   * @param {(v: any) => boolean} fn
   */
  extend(name, fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(`[isx] extend: validator for "${name}" must be a function`);
    }
    _custom[name] = fn;
    _is[name] = fn;
  },

  // ── Strict mode ───────────────────────────────────────────────────────────
  /**
   * Toggle strict mode (match will stop on first error).
   * @param {boolean} val
   */
  strict(val) {
    _strictMode = !!val;
    return _is;
  },

  // ── Assertions ────────────────────────────────────────────────────────────
  get assert() {
    return _buildAssert();
  },
};

// ---------------------------------------------------------------------------
// The callable `is` — supports both is.string(v) and is(v).string()
// ---------------------------------------------------------------------------
const is = new Proxy(_wrap, {
  get(_, key) {
    return _is[key];
  },
  set(_, key, value) {
    _is[key] = value;
    return true;
  },
});

export default is;

// ---------------------------------------------------------------------------
// Named re-exports for tree-shaking
// ---------------------------------------------------------------------------
export {
  typeOf,
  deepEqual,
  isString,
  isNumber, isNaN as isNaN, isInteger, isFloat,
  isOdd, isEven, isPositive, isNegative,
  isFiniteNumber, isInfinite, isSafeInteger, isZero,
  isObject, isPlainObject, isArray, isMap, isSet,
  isWeakMap, isWeakSet, isDate, isRegExp, isError,
  isPromise, hasKey, hasKeys,
  isNil, isNull, isUndefined, isDefined,
  isTruthy, isFalsy, isBoolean, isFunction,
  isSymbol, isBigInt, isPrimitive, isIterable,
  isAsyncFunction, isGeneratorFunction,
  isEmpty, isNotEmpty,
  _match as match,
  _schema as schema,
};
