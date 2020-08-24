import { list } from '@/service/dva';
export default {
  namespace: 'dvaTest',
  state: {
    list: [],
  },
  effects: {
    *list({ payload, callback }: any, { put, call }: any) {
      console.log(payload, callback, put, call);
      const res = yield call(list, payload);
      // yield put({
      //   type: 'listInfo',
      //   payload: res,
      // });
      if (callback) {
        callback(res);
      }
    },
  },
  reducers: {
    listInfo(state, action) {
      return {
        ...state,
        list: action.payload, // action.payload  即 res
      };
    },
  },
};
