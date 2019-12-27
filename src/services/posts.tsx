import request from 'utils/request';
import { IPost } from 'types';

export async function queryPostList(params: IPost) {
  return request(`/api/admin/posts`, {
    method: 'GET',
  });
}
