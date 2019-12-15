import { pathMatchRegexp } from 'utils';
import { queryUserList, createUser, removeUser, updateUser, removeUserList } from 'services/user';
import { IModel, IConnectState, Reducer, Effect } from './index';
import { IUser } from 'types';

export type ICurrentItem = Partial<IUser>;

export interface IUserModelState {
  currentItem: ICurrentItem;
  modalVisible: boolean;
  modalType: 'create' | 'update';
  selectedRowKeys: Array<string>;
  list: Array<IUser>;
  pagination?: {
    showSizeChanger: boolean;
    showQuickJumper: boolean;
    current: number;
    total: number;
    pageSize: number;
  };
}

export interface IUserModelType extends IModel<IUserModelState> {
  namespace: 'user';
  effects: {
    query: Effect;
    delete: Effect;
    multiDelete: Effect;
    create: Effect;
    update: Effect;
  };
  reducers: {
    showModal: Reducer<IUserModelState>;
    hideModal: Reducer<IUserModelState>;
    querySuccess: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModelType = {
  namespace: 'user',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/user', location.pathname)) {
          // @ts-ignore
          const payload = location.query || { page: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          });
        }
      });
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const { success, data } = yield call(queryUserList, payload);

      if (success && data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(data.page) || 1,
              pageSize: Number(data.per_page) || 10,
              total: Number(data.total_page),
            },
          },
        });
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeUser, { id: payload });
      const { selectedRowKeys } = yield select((state: IConnectState) => state.user);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter((item: string) => item !== payload),
          },
        });
      } else {
        throw data;
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeUserList, payload);
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } });
      } else {
        throw data;
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createUser, payload);
      if (data.success) {
        yield put({ type: 'hideModal' });
      } else {
        throw data;
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }: IConnectState) => user.currentItem.id);
      const newUser = { ...payload, id };
      const data = yield call(updateUser, newUser);
      if (data.success) {
        yield put({ type: 'hideModal' });
      } else {
        throw data;
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state) {
      return { ...state, modalVisible: false };
    },

    querySuccess(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },
};

export default UserModel;
