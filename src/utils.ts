export function roundDigitsLength(value: number, length: number): number {
  return parseFloat(value.toFixed(length));
}
