/* global window */

import { router } from 'utils';
import { stringify } from 'qs';
import { queryLayout, pathMatchRegexp } from 'utils';
import { CANCEL_REQUEST_MESSAGE } from 'utils/constants';
import { logoutUser, queryUserInfo } from 'services/users';
import { IMenuItem, INotificationItem, ITheme } from 'types';
import { IModel, Reducer, Subscription, IConnectState } from 'models';
import { Effect } from 'dva';
import store from 'store';
import config from 'utils/config';

const goDashboard = () => {
  if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
    router.push({
      pathname: '/dashboard',
    });
  }
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
  effects: {
    sessionTimeout: Effect;
    query: Effect;
    signOut: Effect;
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
      const token = store.get('token', '');
      const { locationPathname } = yield select((state: IConnectState) => state.app);

      if (token === '') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        });
        return;
      }

      const { success, data: user } = yield call(queryUserInfo, payload);
      if (success && user) {
        store.set('user', user);
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

    *sessionTimeout({ payload }, { call, select }) {
      const { locationPathname } = yield select((state: IConnectState) => state.app);
      store.clearAll();
      router.push({
        pathname: '/login',
        search: stringify({
          from: locationPathname,
        }),
      });
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
