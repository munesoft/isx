/**
 * @munesoft/isx - Deep equality
 * Iterative approach to avoid stack overflow on deeply nested structures.
 */

/**
 * Deep equality check between two values.
 * Handles: primitives, arrays, plain objects, Date, RegExp, Map, Set.
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function deepEqual(a, b) {
  // Use a stack instead of recursion
  const stack = [[a, b]];

  while (stack.length > 0) {
    const [x, y] = stack.pop();

    if (x === y) continue;
    if (x === null || y === null) return false;
    if (x === undefined || y === undefined) return false;

    const tx = typeof x;
    const ty = typeof y;
    if (tx !== ty) return false;

    if (tx !== 'object' && tx !== 'function') {
      // NaN === NaN for our purposes
      if (tx === 'number' && isNaN(x) && isNaN(y)) continue;
      return false;
    }

    // Date
    if (x instanceof Date) {
      if (!(y instanceof Date)) return false;
      if (x.getTime() !== y.getTime()) return false;
      continue;
    }

    // RegExp
    if (x instanceof RegExp) {
      if (!(y instanceof RegExp)) return false;
      if (x.toString() !== y.toString()) return false;
      continue;
    }

    // Map
    if (x instanceof Map) {
      if (!(y instanceof Map)) return false;
      if (x.size !== y.size) return false;
      for (const [k, v] of x) {
        if (!y.has(k)) return false;
        stack.push([v, y.get(k)]);
      }
      continue;
    }

    // Set
    if (x instanceof Set) {
      if (!(y instanceof Set)) return false;
      if (x.size !== y.size) return false;
      for (const v of x) {
        if (!y.has(v)) return false;
      }
      continue;
    }

    // Array
    if (Array.isArray(x)) {
      if (!Array.isArray(y)) return false;
      if (x.length !== y.length) return false;
      for (let i = x.length - 1; i >= 0; i--) {
        stack.push([x[i], y[i]]);
      }
      continue;
    }

    // Plain objects
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length) return false;

    for (const k of xKeys) {
      if (!Object.prototype.hasOwnProperty.call(y, k)) return false;
      stack.push([x[k], y[k]]);
    }
  }

  return true;
}
