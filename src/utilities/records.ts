/**
 * Converts an array into a Record object indexed by a specific key.
 */
export function toRecord<T, K extends keyof T>(
  array: T[],
  key: K,
): Record<(string & T[K]) | (number & T[K]), Omit<T, K>> {
  return Object.fromEntries(
    array.map((item) => {
      const { [key]: indexKey, ...rest } = item;
      return [indexKey, rest];
    }),
  ) as Record<(string & T[K]) | (number & T[K]), Omit<T, K>>;
}
