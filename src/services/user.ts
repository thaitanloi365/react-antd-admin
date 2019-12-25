import request from 'utils/request';
import { IUser } from 'types';

export interface LoginParamsType {
  email: string;
  password: string;
}

export async function queryUserList() {
  return request('/api/admin/users', {
    method: 'GET',
  });
}

export async function logoutUser() {
  return request('/api/logout', {
    method: 'DELETE',
  });
}

export async function queryUserInfo(params: LoginParamsType) {
  return request('/api/app/user', {
    method: 'GET',
  });
}

export async function createUser(params: IUser) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function removeUser(id: string) {
  return request(`/api/admin/users/${id}`, {
    method: 'DELETE',
  });
}

export async function updateUser(params: IUser) {
  const { id, ...payload } = params
  return request(`/api/admin/users/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

export async function removeUserList(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function queryUser(id: string) {
  return request(`/api/admin/users/${id}`, {
    method: 'GET',
  });
}
