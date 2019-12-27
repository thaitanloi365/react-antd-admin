import { accountLogin } from 'services/login';
import { IModel, Effect } from './index';
import router from 'umi/router';
import store from 'store';

export interface ILoginModelState {}

export interface ILoginModelType extends IModel<ILoginModelState> {
  effects: {
    login: Effect;
  };
}

const Model: ILoginModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const { success, data } = yield call(accountLogin, payload);
      if (success && data) {
        store.set('token', data.token);
        store.set('user', data.user);
        router.push('/dashboard');
      } else {
        throw data;
      }
    },
  },
};

export default Model;
