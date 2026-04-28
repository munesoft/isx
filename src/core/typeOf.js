/**
 * @munesoft/isx - Core type detection engine
 * Optimized for performance: typeof first, then tag-based fallback
 */

const toString = Object.prototype.toString;

// Pre-computed tag map for O(1) lookup
const TAG_MAP = {
  '[object Array]':     'array',
  '[object Object]':    'object',
  '[object Function]':  'function',
  '[object Date]':      'date',
  '[object RegExp]':    'regexp',
  '[object Map]':       'map',
  '[object Set]':       'set',
  '[object WeakMap]':   'weakmap',
  '[object WeakSet]':   'weakset',
  '[object Symbol]':    'symbol',
  '[object Promise]':   'promise',
  '[object Error]':     'error',
  '[object Null]':      'null',
  '[object Undefined]': 'undefined',
  '[object Boolean]':   'boolean',
  '[object Number]':    'number',
  '[object String]':    'string',
  '[object BigInt]':    'bigint',
  '[object ArrayBuffer]':       'arraybuffer',
  '[object DataView]':          'dataview',
  '[object Int8Array]':         'int8array',
  '[object Uint8Array]':        'uint8array',
  '[object Uint8ClampedArray]': 'uint8clampedarray',
  '[object Int16Array]':        'int16array',
  '[object Uint16Array]':       'uint16array',
  '[object Int32Array]':        'int32array',
  '[object Uint32Array]':       'uint32array',
  '[object Float32Array]':      'float32array',
  '[object Float64Array]':      'float64array',
};

/**
 * Get the precise type of a value.
 * Hot path: typeof handles primitives in one op; tag map handles the rest.
 * @param {*} val
 * @returns {string}
 */
export function typeOf(val) {
  // Fast path for most common cases
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';

  const t = typeof val;

  // primitives (except object/function) resolve immediately
  if (t === 'number') return isNaN(val) ? 'nan' : 'number';
  if (t !== 'object' && t !== 'function') return t; // string, boolean, symbol, bigint

  // Arrays are extremely common — check before tag lookup
  if (Array.isArray(val)) return 'array';

  return TAG_MAP[toString.call(val)] ?? t;
}
