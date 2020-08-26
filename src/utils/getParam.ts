import qs from 'querystring';
/**
 *
 * @param paramName 参数名称
 * @param url
 */
export function getParam(paramName: string, url: string) {
  const query = url.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === paramName) {
      return pair[1];
    }
  }
  return null;
}

export function parseSearch(str: string, symbol1 = '&', symbol2 = '=') {
  return qs.parse(str.split('?')[1], symbol1, symbol2);
}
