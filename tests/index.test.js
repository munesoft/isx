/**
 * @munesoft/isx - Test suite
 * Run with: node --experimental-vm-modules tests/index.test.js
 * (or via a test runner like vitest / jest with ESM support)
 *
 * Self-contained: uses a tiny assert helper, no external deps.
 */

import is, {
  typeOf, deepEqual,
  isString, isNumber, isInteger, isFloat, isOdd, isEven,
  isNaN as isNaN_, isPositive, isNegative, isFiniteNumber, isInfinite,
  isArray, isObject, isPlainObject, isMap, isSet, isDate, isRegExp,
  isPromise, isError, hasKey, hasKeys,
  isNil, isNull, isUndefined, isDefined,
  isTruthy, isFalsy, isBoolean, isFunction, isPrimitive,
  isEmpty, isNotEmpty,
  match, schema,
} from '../src/index.js';

// ---------------------------------------------------------------------------
// Tiny test harness
// ---------------------------------------------------------------------------
let pass = 0, fail = 0;

function test(desc, fn) {
  try {
    fn();
    console.log(`  ✅  ${desc}`);
    pass++;
  } catch (e) {
    console.log(`  ❌  ${desc}`);
    console.log(`      ${e.message}`);
    fail++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg ?? 'Assertion failed');
}

function eq(a, b) {
  assert(a === b, `Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
}

// ---------------------------------------------------------------------------
// typeOf
// ---------------------------------------------------------------------------
console.log('\n── typeOf ──');
test('null',      () => eq(typeOf(null),        'null'));
test('undefined', () => eq(typeOf(undefined),   'undefined'));
test('string',    () => eq(typeOf('hi'),         'string'));
test('number',    () => eq(typeOf(42),           'number'));
test('NaN',       () => eq(typeOf(NaN),          'nan'));
test('boolean',   () => eq(typeOf(true),         'boolean'));
test('array',     () => eq(typeOf([]),            'array'));
test('object',    () => eq(typeOf({}),            'object'));
test('function',  () => eq(typeOf(() => {}),      'function'));
test('date',      () => eq(typeOf(new Date()),    'date'));
test('regexp',    () => eq(typeOf(/x/),           'regexp'));
test('map',       () => eq(typeOf(new Map()),     'map'));
test('set',       () => eq(typeOf(new Set()),     'set'));
test('symbol',    () => eq(typeOf(Symbol()),      'symbol'));
test('bigint',    () => eq(typeOf(1n),            'bigint'));

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------
console.log('\n── Primitives ──');
test('isString true',        () => assert(isString('hello')));
test('isString false',       () => assert(!isString(42)));
test('isNumber true',        () => assert(isNumber(42)));
test('isNumber false NaN',   () => assert(!isNumber(NaN)));
test('isBoolean true',       () => assert(isBoolean(false)));
test('isPrimitive string',   () => assert(isPrimitive('x')));
test('isPrimitive obj',      () => assert(!isPrimitive({})));

// ---------------------------------------------------------------------------
// Numeric helpers
// ---------------------------------------------------------------------------
console.log('\n── Numbers ──');
test('isInteger 10',         () => assert(isInteger(10)));
test('isInteger 1.5 false',  () => assert(!isInteger(1.5)));
test('isFloat 1.5',          () => assert(isFloat(1.5)));
test('isFloat 2 false',      () => assert(!isFloat(2)));
test('isOdd 3',              () => assert(isOdd(3)));
test('isOdd 4 false',        () => assert(!isOdd(4)));
test('isEven 4',             () => assert(isEven(4)));
test('isEven 3 false',       () => assert(!isEven(3)));
test('isNaN_ NaN',           () => assert(isNaN_(NaN)));
test('isNaN_ 0 false',       () => assert(!isNaN_(0)));
test('isPositive 1',         () => assert(isPositive(1)));
test('isNegative -1',        () => assert(isNegative(-1)));
test('isFiniteNumber 1',     () => assert(isFiniteNumber(1)));
test('isInfinite Infinity',  () => assert(isInfinite(Infinity)));

// ---------------------------------------------------------------------------
// Array / Object
// ---------------------------------------------------------------------------
console.log('\n── Arrays & Objects ──');
test('isArray []',           () => assert(isArray([])));
test('isArray {} false',     () => assert(!isArray({})));
test('isObject {}',          () => assert(isObject({})));
test('isObject null false',  () => assert(!isObject(null)));
test('isPlainObject {}',     () => assert(isPlainObject({})));
test('isPlainObject null false', () => assert(!isPlainObject(null)));
test('isPlainObject class false', () => assert(!isPlainObject(new Date())));
test('isMap',                () => assert(isMap(new Map())));
test('isSet',                () => assert(isSet(new Set())));
test('isDate',               () => assert(isDate(new Date())));
test('isRegExp',             () => assert(isRegExp(/x/)));
test('isPromise',            () => assert(isPromise(Promise.resolve())));
test('isError',              () => assert(isError(new Error('x'))));
test('hasKey',               () => assert(hasKey({ a: 1 }, 'a')));
test('hasKey miss',          () => assert(!hasKey({ a: 1 }, 'b')));
test('hasKeys',              () => assert(hasKeys({ a: 1, b: 2 }, ['a', 'b'])));
test('hasKeys partial miss', () => assert(!hasKeys({ a: 1 }, ['a', 'b'])));

// ---------------------------------------------------------------------------
// Nil / existence
// ---------------------------------------------------------------------------
console.log('\n── Nil & Existence ──');
test('isNil null',           () => assert(isNil(null)));
test('isNil undefined',      () => assert(isNil(undefined)));
test('isNil 0 false',        () => assert(!isNil(0)));
test('isNull',               () => assert(isNull(null)));
test('isUndefined',          () => assert(isUndefined(undefined)));
test('isDefined 0',          () => assert(isDefined(0)));
test('isTruthy 1',           () => assert(isTruthy(1)));
test('isFalsy 0',            () => assert(isFalsy(0)));
test('isFalsy ""',           () => assert(isFalsy('')));

// ---------------------------------------------------------------------------
// Empty / notEmpty
// ---------------------------------------------------------------------------
console.log('\n── Empty ──');
test('isEmpty []',           () => assert(isEmpty([])));
test('isEmpty ""',           () => assert(isEmpty('')));
test('isEmpty {}',           () => assert(isEmpty({})));
test('isEmpty new Map()',    () => assert(isEmpty(new Map())));
test('isEmpty null',         () => assert(isEmpty(null)));
test('isNotEmpty [1]',       () => assert(isNotEmpty([1])));
test('isNotEmpty "a"',       () => assert(isNotEmpty('a')));

// ---------------------------------------------------------------------------
// deepEqual
// ---------------------------------------------------------------------------
console.log('\n── deepEqual ──');
test('primitives eq',        () => assert(deepEqual(1, 1)));
test('primitives ne',        () => assert(!deepEqual(1, 2)));
test('NaN eq NaN',           () => assert(deepEqual(NaN, NaN)));
test('arrays eq',            () => assert(deepEqual([1, [2, 3]], [1, [2, 3]])));
test('arrays ne',            () => assert(!deepEqual([1, 2], [1, 3])));
test('objects eq',           () => assert(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })));
test('objects ne',           () => assert(!deepEqual({ a: 1 }, { a: 2 })));
test('Date eq',              () => assert(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))));
test('Date ne',              () => assert(!deepEqual(new Date('2024-01-01'), new Date('2025-01-01'))));
test('Map eq',               () => { const m1 = new Map([['a',1]]); const m2 = new Map([['a',1]]); assert(deepEqual(m1, m2)); });
test('Set eq',               () => { const s1 = new Set([1,2,3]); const s2 = new Set([1,2,3]); assert(deepEqual(s1, s2)); });

// ---------------------------------------------------------------------------
// is.type()
// ---------------------------------------------------------------------------
console.log('\n── is.type ──');
test('is.type string',       () => eq(is.type('hello'), 'string'));
test('is.type array',        () => eq(is.type([]), 'array'));
test('is.type NaN',          () => eq(is.type(NaN), 'nan'));

// ---------------------------------------------------------------------------
// is() functional style
// ---------------------------------------------------------------------------
console.log('\n── Functional style  is(value).check() ──');
test('is("hi").string()',     () => assert(is('hi').string()));
test('is(42).number()',       () => assert(is(42).number()));
test('is([]).array()',        () => assert(is([]).array()));
test('is(3).odd()',           () => assert(is(3).odd()));

// ---------------------------------------------------------------------------
// is.assert
// ---------------------------------------------------------------------------
console.log('\n── is.assert ──');
test('assert.string passes', () => is.assert.string('hello'));
test('assert.string throws', () => {
  let threw = false;
  try { is.assert.string(42); } catch { threw = true; }
  assert(threw, 'should have thrown');
});
test('assert.number passes', () => is.assert.number(99));

// ---------------------------------------------------------------------------
// is.match / schema
// ---------------------------------------------------------------------------
console.log('\n── match & schema ──');
const user = { id: 42, name: 'Alice' };

test('match valid',          () => {
  const r = is.match(user, { id: 'number', name: 'string' });
  assert(r.valid, JSON.stringify(r.errors));
});

test('match invalid',        () => {
  const r = is.match({ id: 'oops', name: 'Alice' }, { id: 'number', name: 'string' });
  assert(!r.valid);
  assert(r.errors.length === 1);
});

test('match deep',           () => {
  const obj = { user: { id: 1, name: 'Bob' } };
  const r = is.match(obj, { user: { id: 'number', name: 'string' } }, { deep: true });
  assert(r.valid, JSON.stringify(r.errors));
});

test('schema reusable',      () => {
  const validate = is.schema({ id: 'number', name: 'string' });
  assert(validate(user).valid);
  assert(!validate({ id: 'bad' }).valid);
});

test('schema constructor rule', () => {
  const r = is.match({ d: new Date() }, { d: Date });
  assert(r.valid);
});

test('schema function rule', () => {
  const r = is.match({ age: 25 }, { age: (v) => v >= 18 });
  assert(r.valid);
  const r2 = is.match({ age: 10 }, { age: (v) => v >= 18 });
  assert(!r2.valid);
});

// ---------------------------------------------------------------------------
// Custom validators
// ---------------------------------------------------------------------------
console.log('\n── Custom validators ──');
test('is.extend positive', () => {
  is.extend('strictPositive', (n) => typeof n === 'number' && n > 0);
  assert(is.strictPositive(5));
  assert(!is.strictPositive(-1));
  assert(is('hi').strictPositive() === false);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${'─'.repeat(40)}`);
console.log(`Passed: ${pass}  Failed: ${fail}  Total: ${pass + fail}`);
if (fail > 0) process.exit(1);
