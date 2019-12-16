import request from 'utils/request';

export async function queryPostList() {
  return request('/cms/posts', {
    method: 'GET',
  });
}
