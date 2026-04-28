/**
 * @munesoft/isx - Performance benchmarks
 * Compares isx against hand-rolled equivalents and reports ops/sec.
 *
 * Run: node benchmarks/bench.js
 */

import is, { typeOf, isString, isNumber, isPlainObject, deepEqual } from '../src/index.js';

const ITERATIONS = 2_000_000;

function bench(name, fn) {
  // Warm-up
  for (let i = 0; i < 10_000; i++) fn();

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) fn();
  const ms = performance.now() - start;
  const ops = (ITERATIONS / (ms / 1000)).toFixed(0);
  console.log(`  ${name.padEnd(40)} ${(ms).toFixed(1).padStart(8)}ms   ${ops.padStart(13)} ops/s`);
}

console.log(`\n${'═'.repeat(72)}`);
console.log('  @munesoft/isx — Benchmarks');
console.log(`  ${ITERATIONS.toLocaleString()} iterations per test`);
console.log(`${'═'.repeat(72)}\n`);

// ── typeOf ────────────────────────────────────────────────────────────────
console.log('typeOf');
bench('typeOf(null)',           () => typeOf(null));
bench('typeOf("string")',       () => typeOf('string'));
bench('typeOf(42)',             () => typeOf(42));
bench('typeOf(NaN)',            () => typeOf(NaN));
bench('typeOf([])',             () => typeOf([]));
bench('typeOf({})',             () => typeOf({}));
bench('typeOf(new Map())',      () => typeOf(new Map()));

// ── is.string ────────────────────────────────────────────────────────────
console.log('\nis.string vs typeof');
bench('is.string("hello")',           () => is.string('hello'));
bench('typeof "hello" === "string"',  () => typeof 'hello' === 'string');

// ── is.number ────────────────────────────────────────────────────────────
console.log('\nis.number');
bench('is.number(42)',                () => is.number(42));
bench('is.odd(3)',                    () => is.odd(3));
bench('is.even(4)',                   () => is.even(4));

// ── is.plainObject ────────────────────────────────────────────────────────
const plainObj = { a: 1, b: 2 };
console.log('\nis.plainObject');
bench('isPlainObject({})',            () => isPlainObject({}));
bench('isPlainObject(plainObj)',      () => isPlainObject(plainObj));
bench('isPlainObject(new Date())',    () => isPlainObject(new Date()));

// ── deepEqual ────────────────────────────────────────────────────────────
const a = { x: 1, y: [2, 3], z: { w: 4 } };
const b = { x: 1, y: [2, 3], z: { w: 4 } };
const c = { x: 1, y: [2, 3], z: { w: 5 } };
console.log('\ndeepEqual');
bench('deepEqual equal objs',         () => deepEqual(a, b));
bench('deepEqual unequal objs',       () => deepEqual(a, c));
bench('deepEqual primitives',         () => deepEqual(42, 42));
bench('deepEqual arrays',             () => deepEqual([1, 2, 3], [1, 2, 3]));

// ── is() functional ────────────────────────────────────────────────────────
console.log('\nis() functional style overhead');
bench('is("hello").string()',         () => is('hello').string());
bench('is.string("hello")',           () => is.string('hello'));

// ── is.match ──────────────────────────────────────────────────────────────
const user = { id: 42, name: 'Alice', active: true };
const userSchema = { id: 'number', name: 'string', active: 'boolean' };
console.log('\nis.match (schema validation)');
bench('is.match 3-field schema',      () => is.match(user, userSchema));

console.log(`\n${'═'.repeat(72)}\n`);
