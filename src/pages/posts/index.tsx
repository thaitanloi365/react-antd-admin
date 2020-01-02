import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { IConnectState } from 'models';
import List from './components/List';
import Filter from './components/Filter';
import PostModal from './components/Modal';

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

  onAdd = () => {
    this.togglePostModal();
  };

  onAccept = (values: any) => {
    console.log('values', values);
    const { dispatch } = this.props;
    dispatch({
      type: 'posts/create',
      payload: values,
    });
  };

  togglePostModal = () => {
    const { dispatch, posts } = this.props;
    const { modalVisible } = posts;
    if (modalVisible) {
      dispatch({
        type: 'posts/hideModal',
      });
    } else {
      dispatch({
        type: 'posts/showModal',
      });
    }
  };

  render() {
    const { posts } = this.props;
    const { modalVisible, modalType, currentItem } = posts;
    console.log('posts', posts);
    return (
      <Card>
        <Filter onAdd={this.onAdd} />
        <List dataSource={posts.list} pagination={posts.pagination} />
        <PostModal
          title={`${modalType} Post`}
          destroyOnClose={true}
          visible={modalVisible}
          onAccept={this.onAccept}
          onCancel={this.togglePostModal}
          item={modalType === 'create' ? null : currentItem}
        />
      </Card>
    );
  }
}

export default connect(({ posts, loading }: IConnectState) => ({ posts, loading }))(Posts);
