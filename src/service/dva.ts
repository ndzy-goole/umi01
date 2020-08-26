/*
 * @Descripttion:
 * @version:
 * @Author: 张一
 * @Date: 2020-08-24 17:29:22
 * @LastEditors: 张一
 * @LastEditTime: 2020-08-26 09:07:27
 */
import http from '@/utils/http';
import { AnyObj } from '@/types';

export async function list(params: AnyObj) {
  const params_ = {
    url: 'api/dva',
    data: params,
  };
  const res = await http.post(params_);
  return res;
}
