export function isJsonString(str: unknown): boolean {
  if (typeof str !== 'string') { return false; }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
