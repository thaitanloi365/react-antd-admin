import { pathMatchRegexp } from 'utils';
import { queryPostList } from 'services/posts';
import { IModel, IConnectState, Reducer, Effect } from './index';
import { IPost } from 'types';

export type ICurrentItem = IPost;

export interface IPostModelState {
  currentItem: ICurrentItem;
  modalVisible: boolean;
  modalType: 'create' | 'update';
  selectedRowKeys: Array<string>;
  list: Array<IPost>;
  pagination?: {
    showSizeChanger: boolean;
    showQuickJumper: boolean;
    current: number;
    total: number;
    pageSize: number;
  };
}

export interface IUserModelType extends IModel<IPostModelState> {
  namespace: 'posts';
  effects: {
    query: Effect;
    // delete: Effect;
    // multiDelete: Effect;
    // create: Effect;
    // update: Effect;
  };
  reducers: {
    showModal: Reducer<IPostModelState>;
    hideModal: Reducer<IPostModelState>;
    querySuccess: Reducer<IPostModelState>;
  };
}

const PostModel: IUserModelType = {
  namespace: 'posts',
  state: {
    currentItem: null,
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
        if (pathMatchRegexp('/posts', location.pathname)) {
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
      const { success, data } = yield call(queryPostList, payload);

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

    // *delete({ payload }, { call, put, select }) {
    //   const data = yield call(removeUser, payload);
    //   const { selectedRowKeys } = yield select((state: IConnectState) => state.users);
    //   if (data.success) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {
    //         selectedRowKeys: selectedRowKeys.filter((item: string) => item !== payload),
    //       },
    //     });
    //   } else {
    //     throw data;
    //   }
    // },

    // *multiDelete({ payload }, { call, put }) {
    //   const data = yield call(removeUserList, payload);
    //   if (data.success) {
    //     yield put({ type: 'updateState', payload: { selectedRowKeys: [] } });
    //   } else {
    //     throw data;
    //   }
    // },

    // *create({ payload }, { call, put }) {
    //   const { imageFile } = payload;
    //   if (imageFile) {
    //     const { success, data } = yield call(getS3Signature);
    //     if (success) {
    //       const formData = new FormData();
    //       const key = `images/${imageFile.uid}_${imageFile.name}`;
    //       const { url, ...other } = data;

    //       Object.keys(other).forEach(k => formData.append(k, other[k]));

    //       formData.append('key', key);
    //       formData.append('file', imageFile);

    //       const response = yield call(uploadImage, url, formData);
    //       if (response.success) {
    //         payload['avatar'] = `${url}/${key}`;
    //       }
    //     }
    //   }

    //   const data = yield call(createUser, payload);
    //   if (data.success) {
    //     yield put({ type: 'hideModal' });
    //   } else {
    //     throw data;
    //   }
    // },

    // *update({ payload }, { select, call, put }) {
    //   const { imageFile } = payload;
    //   if (imageFile) {
    //     const { success, data } = yield call(getS3Signature);
    //     if (success) {
    //       const formData = new FormData();
    //       const key = `images/${imageFile.uid}_${imageFile.name}`;
    //       const { url, ...other } = data;

    //       Object.keys(other).forEach(k => formData.append(k, other[k]));

    //       formData.append('key', key);
    //       formData.append('file', imageFile);

    //       const response = yield call(uploadImage, url, formData);
    //       if (response.success) {
    //         payload['avatar'] = `${url}/${key}`;
    //       }
    //     }
    //   }

    //   const data = yield call(updateUser, payload);
    //   if (data.success) {
    //     yield put({ type: 'hideModal' });
    //   } else {
    //     throw data;
    //   }
    // },
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

export default PostModel;
