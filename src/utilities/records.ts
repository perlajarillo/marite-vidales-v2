/**
 * Converts an array into a Record object indexed by a specific key.
 */
export function toRecord<T, K extends keyof T>(
  array: T[],
  key: K,
): Record<(string & T[K]) | (number & T[K]), T> {
  return Object.fromEntries(array.map((item) => [item[key], item])) as Record<
    (string & T[K]) | (number & T[K]),
    T
  >;
}
