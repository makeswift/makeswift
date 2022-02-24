export default function is(x: unknown, y: unknown): boolean {
  if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y;

  return x !== x && y !== y;
}
