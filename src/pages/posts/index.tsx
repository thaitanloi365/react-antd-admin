import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { IConnectState } from 'models';
import List from './components/List';

interface IPostProps extends IConnectState {
  dispatch: Function;
  loading: any;
  location: any;
}

class Posts extends Component<IPostProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'posts/query',
    });
  }
  render() {
    const { posts } = this.props;
    console.log('posts', posts);
    return (
      <Card>
        <List dataSource={posts.list} pagination={posts.pagination} />
      </Card>
    );
  }
}

export default connect(({ posts, loading }: IConnectState) => ({ posts, loading }))(Posts);
