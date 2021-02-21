export function isJsonString(str: unknown): boolean {
  if (typeof str !== 'string') { return false; }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function uniqAndSort(array: number[]) {
  return [...new Set(array.sort((n1, n2) => n1 - n2))];
}
