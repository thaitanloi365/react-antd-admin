import request from 'utils/request';

export interface LoginParamsType {
  email: string;
  password: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}
