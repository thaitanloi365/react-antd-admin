import { FormComponentProps } from 'antd/lib/form/Form';

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
}

export interface IFormProps extends FormComponentProps {}

export type IMenus = Array<IMenuItem>;
