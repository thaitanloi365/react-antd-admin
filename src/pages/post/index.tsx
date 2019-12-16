import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import List from './components/List';
import { IConnectState } from 'models';

interface IPostProps {
  post: any;
  dispatch: Function;
  loading: any;
  location: any;
}

class Post extends PureComponent<IPostProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'post/query',
    });
  }

  render() {
    const {
      post: { list, pagination },
      loading,
    } = this.props;
    const tableProps = { dataSource: list, pagination, loading: loading.effects['post/query'] };
    return (
      <Card>
        <List {...tableProps} />
      </Card>
    );
  }
}

export default connect(({ post, loading }: IConnectState) => ({ post, loading }))(Post);
