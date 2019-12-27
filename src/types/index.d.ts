import { FormComponentProps } from 'antd/lib/form/Form';
import { Reducer } from 'react';
import { Effect } from 'dva';
import { AnyAction } from 'redux';
import { RouterTypes } from 'umi';

import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { LoginModelType } from './login';

export type ITheme = 'dark' | 'light';

export interface ILoginParamsType {
  email: string;
  password: string;
}

export interface IUserQueryParamsType {
  name?: string;
  created_at?: [string, string];
  page?: number;
  per_page?: number;
}

export interface INotificationItem {
  title: string;
  date: Date;
}
export interface IMenuItem {
  id: string;
  icon?: string;
  name?: string;
  route: string;
  breadcrumbParentId?: string;
  menuParentId?: string;
}

export interface IUser {
  created_at: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  updated_at: string;
  avatar: string;
}

export interface IPost {
  created_at: string;
  updated_at: string;
  id: number;
  email: string;
  title: string;
  content: string;
  owner_id: number;
  owner: string;
}

export interface IFilter {
  name: string;
  createTime: Array<Date>;
}

export type IOperation = 'create' | 'update';

export interface IFormProps extends FormComponentProps {}

export type IMenus = Array<IMenuItem>;
