export function isJsonString(str: unknown): boolean {
  if (typeof str !== 'string') {
    return false;
  }
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

export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const isProduction = process.env.NODE_ENV === 'production';

export const isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
);
