import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { cloneDeep } from 'lodash';
import { message } from 'antd';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constants';
import pathToRegexp from 'path-to-regexp';
import config from './config';
import store from 'store';

const codeMessage = {
  400: 'There was an error in the request, and the server did not create or modify data.',
  401: 'The user does not have permissions.',
  403: 'The user is authorized, but access is prohibited.',
  404: 'The request was made for a record that does not exist, and the server did not perform an operation.',
  422: 'When creating an object, a validation error occurred.',
  500: 'A server error occurred. Please check the server.',
  502: 'Gateway error.',
  503: 'Services are unavailable and the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};

const { CancelToken } = axios;
// @ts-ignore
window.cancelRequest = new Map();

const request = (url: string, options: AxiosRequestConfig) => {
  let { data, baseURL = config.baseURL } = options;

  const cloneData = cloneDeep(data);

  try {
    let domain = '';
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/);
    if (urlMatch) {
      [domain] = urlMatch;
      url = url.slice(domain.length);
    }

    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + url;
  } catch (e) {
    message.error(e.message);
  }

  options.url = url;
  options.params = cloneData;
  options.baseURL = baseURL;
  options.cancelToken = new CancelToken(cancel => {
    // @ts-ignore
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    });
  });

  return axios(options)
    .then(response => {
      const { statusText, status, data } = response;

      let result = {};
      if (typeof data === 'object') {
        result = data;
        if (Array.isArray(data)) {
          // @ts-ignore
          result.list = data;
        }
      } else {
        // @ts-ignore
        result.data = data;
      }

      const res = {
        success: true,
        message: statusText,
        statusCode: status,
        data: result,
      };

      console.log('**** response', res);
      return Promise.resolve(res);
    })
    .catch((error: AxiosError) => {
      const { response, message } = error;

      console.log('**** error', response);

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        };
      }

      let msg;
      let statusCode;

      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;

        msg = codeMessage[data.code] || data.message || statusText;
        if (data.code) {
          msg = `[${data.code}] ${msg}`;
        }
      } else {
        statusCode = 600;
        msg = error.message || 'Network Error';
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      });
    });
};

axios.interceptors.request.use(
  function(config) {
    console.log('**** config', config);
    const token = store.get('token');

    if (typeof token === 'string' && token !== '') {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  },
);
export default request;
