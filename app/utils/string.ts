export function minifyString(str: string) {
  return str.replace(/[\n\r\t]+|\s{2,}/g, ' ').replace(/\s{2}/g, ' ');
}
