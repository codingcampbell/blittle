export function createArray(n) {
  let j, arr = [];
  for (j = 0; j < n; j += 1) {
    arr[j] = 0;
  }

  return arr;
}

export function normalizeNegative(x) {
  return (x + 1) / 2;
}
