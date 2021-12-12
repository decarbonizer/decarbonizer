export function assert(condition?: boolean, message = 'Assertion failed.'): asserts condition {
  console.assert(condition, message);

  if (!condition) {
    throw new Error(message);
  }
}
