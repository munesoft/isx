/**
 * @munesoft/isx/number
 * Tree-shakable named exports for number checks.
 */

export const isNumber  = (v) => typeof v === 'number' && !isNaN(v);
export const isNaN_    = (v) => typeof v === 'number' && isNaN(v);
export const isInteger = (v) => typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
export const isFloat   = (v) => typeof v === 'number' && isFinite(v) && Math.floor(v) !== v;
export const isOdd     = (v) => isInteger(v) && (v & 1) !== 0;
export const isEven    = (v) => isInteger(v) && (v & 1) === 0;
export const isPositive      = (v) => typeof v === 'number' && v > 0;
export const isNegative      = (v) => typeof v === 'number' && v < 0;
export const isFiniteNumber  = (v) => typeof v === 'number' && isFinite(v);
export const isInfinite      = (v) => v === Infinity || v === -Infinity;
export const isSafeInteger   = (v) => Number.isSafeInteger(v);
export const isZero          = (v) => v === 0;
