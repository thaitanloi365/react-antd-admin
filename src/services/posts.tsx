import request from 'utils/request';
import { IPost } from 'types';

export async function queryPostList(params: IPost) {
  return request(`/api/admin/posts`, {
    method: 'GET',
  });
}

export async function createPost(params: IPost) {
  return request(`/api/admin/posts`, {
    method: 'POST',
    data: params,
  });
}
