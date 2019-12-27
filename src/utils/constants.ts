import { IMenus } from 'types';

export const ROLE_TYPE = {
  ADMIN: 'admin',
  DEFAULT: 'admin',
  DEVELOPER: 'developer',
};

export const CANCEL_REQUEST_MESSAGE = 'cancel request';

const menus: IMenus = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Users',
    icon: 'user',
    route: '/users',
  },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    route: '/users/:id',
  },
  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Posts',
    icon: 'cloud-upload',
    route: '/posts',
  },
];

export default {
  menus,
};
