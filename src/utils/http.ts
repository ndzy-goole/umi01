/*
 * ie9不支持CROS跨域，只能做服务器代理实现跨域
 */

import axios, { AxiosRequestConfig } from 'axios';
import { isEmpty, isObject, isString, isArray } from 'underscore';
import NProgress from 'nprogress';
import { message } from 'antd';
import { historyHash as history } from './history';
import { getSession } from './storage';

// 请求方法
const method = {
  get: 'get',
  post: 'post',
  put: 'put',
};

// 返回类型
const responseType = {
  json: 'json',
  arraybuffer: 'arraybuffer',
  blob: 'blob',
  document: 'document',
  text: 'text',
  stream: 'stream',
};

//#region 请求或响应 拦截
axios.interceptors.response.use(
  function(response) {
    // IE 9 bug
    if (
      !response.data &&
      response.request.responseText &&
      response.config.responseType === responseType.json
    ) {
      response.data = JSON.parse(response.request.responseText);
    }

    return response;
  },
  function(err) {
    return Promise.reject('网络加载失败，请重试');
  },
);
//#endregion

interface Options {
  allBack: boolean;
}
interface DefaultConfig extends AxiosRequestConfig {
  url: string;
  baseURL: string;
  headers: {
    authorization: string;
  };
  params: {
    [propName: string]: any;
  };
  data: any;
  timeout: number;
  maxRedirects: number;
  cancelToken: any;
  timestamp: boolean;
  single: boolean;
}
interface Config {
  url: string;
  data: any;
  [propName: string]: any;
}

class AxiosPackage {
  defaultConfig: DefaultConfig;
  reqList: { [propName: string]: any };
  cancelMessage: string;
  reqCount: number;

  constructor(baseUrl: string) {
    // 所有可配置参数
    this.defaultConfig = {
      url: '',
      method: 'get',
      baseURL: baseUrl || '',
      headers: {
        authorization: '',
      }, //自定义请求头
      params: {}, //get请求参数
      data: {}, //请求参数
      timeout: 10000, //超时时间
      responseType: 'json', //响应类型
      maxRedirects: 3, //重定向次数
      cancelToken: null, //取消未完成请求

      timestamp: true, //时间戳
      single: false, //同一接口只能同时存在一次请求
    };

    this.reqList = {}; // 当前未完成的请求
    this.cancelMessage = 'stop request';
    this.reqCount = 0;
  }

  //#region post 请求
  /**
   * @name: post
   * @description: post 请求
   * @param {type}
   * @return {type}
   */
  post(params: Config, options?: Options) {
    let config;

    params = Object.assign(
      {},
      this.defaultConfig,
      { method: method.post },
      params,
    );
    config = this.checkParams(params);

    return this.req(config, options);
  }
  //#endregion
  //#region get 请求
  /**
   * @name: get
   * @description: get 请求
   * @param {type}
   * @return {type}
   */
  get(params: Config, options?: Options) {
    let config;

    params = Object.assign(
      {},
      this.defaultConfig,
      { method: method.get },
      params,
    );
    config = this.checkParams(params);

    return this.req(config, options);
  }
  //#endregion
  //#region put 请求
  /**
   * @name: put
   * @description: put 请求
   * @param {type}
   * @return {type}
   */
  put(params: Config, options?: Options) {
    let config;

    params = Object.assign(
      {},
      this.defaultConfig,
      { method: method.put },
      params,
    );
    config = this.checkParams(params);

    return this.req(config, options);
  }
  //#endregion
  //#region req 通用请求
  /**
   * @name: req
   * @description: 通用请求 allBack 不管什么状态都返回结果  spin 是否加载全局loading图标
   * @param {type}
   * @return {type}
   */
  req(config: Config, options: Options = { allBack: false }) {
    let p = null;

    if (isEmpty(config.url)) {
      return Promise.reject('url 不能为空');
    }

    p = new Promise((resolve, reject) => {
      NProgress.start();
      this.reqCount += 1;

      axios(config)
        .then(res => {
          if (options.allBack) {
            resolve(res.data);
            return;
          }

          const resCode = String(res.data.status);

          // 正常状态，返回数据
          if (resCode === '0') {
            resolve(res.data.data);
            return;
          }

          // 登录过期
          if (resCode === '100' || resCode === '101') {
            this.stopAllReq();
            history.push('/login');
            reject('登录过期，请重新登录');
            return;
          }

          reject(res.data.message);
        })
        .catch(err => {
          if (isString(err)) {
            reject(err);
            return;
          }

          reject('axios错误');
        });
    });

    p.catch(err => {
      if (options.allBack) {
        return err;
      }

      if (isString(err)) {
        message.error(err);
        return;
      }

      // 中断请求，不弹提示框
      if (config.single && err.message === this.cancelMessage) {
        return;
      }

      if (err && err.message) {
        message.error(err.message);
      } else {
        message.error('返回数据有误，请重试');
      }
    }).finally(() => {
      if (this.reqList[config.url]) {
        delete this.reqList[config.url];
      }

      this.reqCount -= 1;
      if (this.reqCount <= 0) {
        NProgress.done();
      }
    });

    return p;
  }
  //#endregion

  //#region 请求参数验证
  /**
   * @name: checkParams
   * @description: 请求参数验证
   * @param {type}
   * @return {type}
   */
  checkParams(params: Config) {
    // 序列化data中的对象
    for (let key in params.data) {
      let value = params.data[key];

      if (isObject(value)) {
        // params.data[key] = JSON.stringify(value);
      }
    }

    // 处理get和post参数
    if (params.method === method.get) {
      params.params = params.data || {};
    }

    // 添加时间戳
    if (params.timestamp) {
      params.params.t = Date.now();
    }

    // 中断当前接口的未完成请求
    if (params.single) {
      this.reqList[params.url] && this.reqList[params.url](this.cancelMessage);

      params.cancelToken = new axios.CancelToken(c => {
        this.reqList[params.url] = c;
      });
    }
    // TODO:
    // 自定义请求头
    const userInfo = getSession('history_key');
    let token = '';

    if (isArray(userInfo)) {
      token = userInfo[0].state.loginInfo.token;
    }

    params.headers.authorization = token || '';

    return params;
  }
  //#endregion

  // 中断所有未完成请求
  stopAllReq() {
    for (let key in this.reqList) {
      this.reqList[key] && this.reqList[key](this.cancelMessage);
    }

    this.reqList = {};
  }
}

declare const window: {
  customConfig: {
    baseURL: string;
  };
};

// 单例模式
const request = (function() {
  let instance: AxiosPackage;

  return function() {
    if (!instance) {
      // TODO:
      const baseURL = 'http://localhost:8000/';

      instance = new AxiosPackage(baseURL);
    }

    return instance;
  };
})();

export default request();
