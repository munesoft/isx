/**
 * @munesoft/isx - Schema & match validation
 */

import { typeOf } from '../core/typeOf.js';
import { deepEqual } from '../utils/deepEqual.js';

/**
 * Match a value against a flat or deep schema.
 *
 * Schema values can be:
 *   - a string type name:  "string", "number", "array", etc.
 *   - a constructor:       String, Number, Array, Date, ...
 *   - a function validator: (v) => boolean
 *   - a nested schema object (when deep: true)
 *
 * @param {*} value
 * @param {Object} schema
 * @param {{ deep?: boolean, strict?: boolean }} [opts]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function match(value, schema, opts = {}) {
  const errors = [];

  for (const [key, rule] of Object.entries(schema)) {
    const val = value?.[key];
    const valid = _checkRule(val, rule, key, opts, errors);
    if (!valid && opts.strict) break;
  }

  return { valid: errors.length === 0, errors };
}

function _checkRule(val, rule, key, opts, errors) {
  // String type name
  if (typeof rule === 'string') {
    const actual = typeOf(val);
    if (actual !== rule) {
      errors.push(`"${key}": expected ${rule}, got ${actual}`);
      return false;
    }
    return true;
  }

  // Function validator
  if (typeof rule === 'function' && !isConstructor(rule)) {
    if (!rule(val)) {
      errors.push(`"${key}": failed custom validator`);
      return false;
    }
    return true;
  }

  // Constructor check (String, Number, Array, Date, ...)
  if (typeof rule === 'function') {
    if (!(val instanceof rule) && !primitiveMatches(val, rule)) {
      errors.push(`"${key}": expected instance of ${rule.name}`);
      return false;
    }
    return true;
  }

  // Nested schema (deep mode)
  if (opts.deep && rule !== null && typeof rule === 'object' && !Array.isArray(rule)) {
    const nested = match(val, rule, opts);
    if (!nested.valid) {
      nested.errors.forEach((e) => errors.push(`${key}.${e}`));
      return false;
    }
    return true;
  }

  // Literal equality fallback
  if (!deepEqual(val, rule)) {
    errors.push(`"${key}": expected ${JSON.stringify(rule)}, got ${JSON.stringify(val)}`);
    return false;
  }

  return true;
}

const BUILT_INS = new Set([String, Number, Boolean, BigInt, Symbol]);

function isConstructor(fn) {
  return BUILT_INS.has(fn) || (fn.prototype && fn.prototype.constructor === fn);
}

function primitiveMatches(val, ctor) {
  if (ctor === String)  return typeof val === 'string';
  if (ctor === Number)  return typeof val === 'number';
  if (ctor === Boolean) return typeof val === 'boolean';
  if (ctor === BigInt)  return typeof val === 'bigint';
  return false;
}

/**
 * Build a reusable schema validator.
 * @param {Object} schema
 * @param {{ deep?: boolean }} [opts]
 * @returns {(value: any) => { valid: boolean, errors: string[] }}
 */
export function schema(schemaDef, opts = {}) {
  return (value) => match(value, schemaDef, opts);
}
