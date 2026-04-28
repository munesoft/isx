/**
 * @munesoft/isx/object
 * Tree-shakable named exports for object checks.
 */

const toString = Object.prototype.toString;
const hasOwn   = Object.prototype.hasOwnProperty;

export const isObject = (v) => v !== null && typeof v === 'object';

/**
 * Plain object: created via {} or Object.create(null) or new Object()
 * Equivalent to lodash's isPlainObject but faster for common cases.
 */
export function isPlainObject(v) {
  if (v === null || typeof v !== 'object') return false;
  if (toString.call(v) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(v);
  return proto === null || proto === Object.prototype;
}

export const isArray   = Array.isArray;
export const isMap     = (v) => v instanceof Map;
export const isSet     = (v) => v instanceof Set;
export const isWeakMap = (v) => v instanceof WeakMap;
export const isWeakSet = (v) => v instanceof WeakSet;
export const isDate    = (v) => v instanceof Date && !isNaN(v.getTime());
export const isRegExp  = (v) => v instanceof RegExp;
export const isError   = (v) => v instanceof Error;
export const isPromise = (v) => v !== null && typeof v === 'object' && typeof v.then === 'function';

export const hasKey = (obj, key) =>
  obj !== null && typeof obj === 'object' && hasOwn.call(obj, key);

/**
 * Check that obj has ALL listed keys.
 */
export const hasKeys = (obj, keys) =>
  obj !== null && typeof obj === 'object' && keys.every((k) => hasOwn.call(obj, k));
