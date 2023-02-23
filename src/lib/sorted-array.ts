export function indexOf<T extends string | number>(array: T[], value: T): number {
  let low = 0;
  let high = array.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (array[mid] < value) low = mid + 1;
    else high = mid;
  }
  return array[low] === value ? low : -1;
}

export function getInsertIndex<T extends string | number>(array: T[], value: T): number {
  let low = 0;
  let high = array.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (array[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

export function has<T extends string | number>(array: T[], value: T): boolean {
  return indexOf(array, value) !== -1;
}

export function insert<T extends string | number>(array: T[], value: T): number {
  const index = getInsertIndex(array, value);
  array.splice(index, 0, value);
  return index;
}
