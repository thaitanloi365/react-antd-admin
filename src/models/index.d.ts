import { AnyAction, Reducer } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { IUserModelState } from './user';
import { LoginModelType } from './login';
import { Subscription, Effect } from 'dva';
import { IAppModelType, IAppModelState } from './app';

export { GlobalModelState, Reducer, Effect, Subscription };

export interface IModel<T> {
  namespace?: string;
  state?: T;
  effects?: { [key: string]: Effect };
  reducers?: { [key: string]: Reducer<T> };
  subscriptions?: { [key: string]: Subscription };
}

export interface ILoadingState {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface IConnectState {
  app: IAppModelState;
  loading: ILoadingState;
  user: IUserModelState;
  login: LoginModelType;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface IConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?<K = any>(action: AnyAction): K;
}
