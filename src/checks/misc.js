/**
 * @munesoft/isx/misc
 * Tree-shakable named exports for miscellaneous checks.
 */

export const isNil        = (v) => v === null || v === undefined;
export const isNull       = (v) => v === null;
export const isUndefined  = (v) => v === undefined;
export const isDefined    = (v) => v !== undefined;
export const isTruthy     = (v) => !!v;
export const isFalsy      = (v) => !v;
export const isBoolean    = (v) => typeof v === 'boolean';
export const isFunction   = (v) => typeof v === 'function';
export const isSymbol     = (v) => typeof v === 'symbol';
export const isBigInt     = (v) => typeof v === 'bigint';
export const isPrimitive  = (v) => v !== Object(v);
export const isIterable   = (v) => v !== null && v !== undefined && typeof v[Symbol.iterator] === 'function';
export const isAsyncFunction = (v) =>
  typeof v === 'function' && v.constructor && v.constructor.name === 'AsyncFunction';
export const isGeneratorFunction = (v) =>
  typeof v === 'function' && v.constructor && v.constructor.name === 'GeneratorFunction';

/**
 * Empty check: works on strings, arrays, objects, Map, Set.
 */
export function isEmpty(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' || Array.isArray(v)) return v.length === 0;
  if (v instanceof Map || v instanceof Set) return v.size === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

export const isNotEmpty = (v) => !isEmpty(v);
