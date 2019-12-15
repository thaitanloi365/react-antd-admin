import request from 'utils/request';

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

export async function createUser(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function removeUser(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function updateUser(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function removeUserList(params: LoginParamsType) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}
