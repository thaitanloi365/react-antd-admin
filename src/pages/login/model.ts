import { accountLogin } from 'services/login';
import { saveToken } from 'utils/token';
import router from 'umi/router';
export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      console.log('payload', payload);
      const data = yield call(accountLogin, payload);

      console.log('**** data', data);
      if (data.token) {
        saveToken(data.token);
        router.push('/dashboard');
      } else {
        throw data;
      }
    },
  },
};
