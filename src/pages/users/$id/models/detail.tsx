import { pathMatchRegexp } from 'utils';
import { queryUser } from 'services/users';
import { IModel, Effect, Reducer } from 'models';
import { IUser } from 'types';

export interface IUserDetailModelState {
  data: IUser | Object;
}

export interface IUserDetailModelType extends IModel<IUserDetailModelState> {
  effects: {
    query: Effect;
  };
  reducers: {
    querySuccess: Reducer;
  };
}

const Model: IUserDetailModelType = {
  namespace: 'userDetails',

  state: {
    data: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathMatchRegexp('/users/:id', pathname);

        if (match) {
          dispatch({ type: 'query', payload: match[1] });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      console.log('*** payload', payload);
      const response = yield call(queryUser, payload);
      const { success, message, status, data } = response;
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            data,
          },
        });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        data,
      };
    },
  },
};

export default Model;
