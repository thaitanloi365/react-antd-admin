/* global window */

import { router } from 'utils';
import { stringify } from 'qs';
import store from 'store';
import { ROLE_TYPE } from 'utils/constants';
import { queryLayout, pathMatchRegexp } from 'utils';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constants';
import { logoutUser, queryUserInfo } from 'services/user';
import config from 'utils/config';
import { IMenuItem, INotificationItem, ITheme } from 'types';
import { IModel, Reducer, Subscription, IConnectState } from 'models';

const goDashboard = () => {
  if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
    router.push({
      pathname: '/dashboard',
    });
  }
};

const shouldFetchPrivateData = () => {
  return !pathMatchRegexp('/login', window.location.pathname);
};
export interface IAppModelState {
  routeList: Array<IMenuItem>;
  locationPathname: string;
  locationQuery: any;
  theme: ITheme;
  collapsed: boolean;
  notifications: Array<INotificationItem>;
}

export interface IAppModelType extends IModel<IAppModelState> {
  namespace: 'app';
  reducers: {
    updateState: Reducer<IAppModelState>;
    handleThemeChange: Reducer<IAppModelState>;
    handleCollapseChange: Reducer<IAppModelState>;
    allNotificationsRead: Reducer<IAppModelState>;
  };
  subscriptions: {
    setup: Subscription;
    setupHistory: Subscription;
    setupRequestCancel: Subscription;
  };
}

const AppModel: IAppModelType = {
  namespace: 'app',
  state: {
    routeList: [
      {
        id: '1',
        icon: 'laptop',
        name: 'Dashboard',
        route: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    },
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            // @ts-ignore
            locationQuery: location.query,
          },
        });
      });
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        // @ts-ignore
        const { cancelRequest = new Map() } = window;

        // @ts-ignore
        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE);
            cancelRequest.delete(key);
          }
        });
      });
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const isInit = store.get('isInit');
      const token = store.get('token');
      if (isInit) {
        goDashboard();
        return;
      }

      if (!shouldFetchPrivateData()) {
        return;
      }

      const { locationPathname } = yield select((state: IConnectState) => state.app);
      const { success, data: user } = yield call(queryUserInfo, payload);

      console.log('user', user, success);
      if (success && user) {
        store.set('user', user);
        store.set('isInit', true);
        goDashboard();
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        });
      }
    },

    *signOut({ payload }, { call, select }) {
      const data = yield call(logoutUser);
      const { locationPathname } = yield select((state: IConnectState) => state.app);
      if (data.success) {
        store.clearAll();
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        });
      } else {
        throw data;
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload);
      state.theme = payload;
      return state;
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload);
      state.collapsed = payload;
      return state;
    },

    allNotificationsRead(state) {
      state.notifications = [];
      return state;
    },
  },
};

export default AppModel;
