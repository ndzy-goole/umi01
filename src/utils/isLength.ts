/**
 *
 * @param paramName 参数名称
 * @param url
 */
export function isLength(str: string | number, num?: number) {
  str = String(str);

  if (
    (str.length > 0 && (str !== 'null' || str !== undefined)) ||
    str !== 'NaN'
  ) {
    if (num) {
      return str.slice(0, num);
    }
    return str;
  }
  return '---';
}
