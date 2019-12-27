import React, { PureComponent } from 'react';
import { router } from 'utils';
import { connect } from 'dva';
import { Row, Col, Button, Popconfirm } from 'antd';
import { Page } from 'components';
import { stringify } from 'qs';
import { IConnectState } from 'models';
import List from './components/List';
import Filter from './components/Filter';
import Modal from './components/Modal';
import { IUserQueryParamsType } from 'types';

interface IUserProps extends IConnectState {
  dispatch: Function;
  loading: any;
  location: any;
}

class User extends PureComponent<IUserProps> {
  handleRefresh = (newQuery?: IUserQueryParamsType) => {
    const { location } = this.props;
    const { query, pathname } = location;

    console.log(newQuery);
    router.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' },
      ),
    });
  };

  handleDeleteItems = () => {
    const { dispatch, users } = this.props;
    const { list, pagination, selectedRowKeys } = users;

    dispatch({
      type: 'users/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    }).then(() => {
      this.handleRefresh({
        page:
          list.length === selectedRowKeys.length && pagination.current > 1
            ? pagination.current - 1
            : pagination.current,
      });
    });
  };

  renderFilter() {
    const { location, dispatch } = this.props;
    const { query } = location;

    return (
      <Filter
        filter={{ ...query }}
        onFilterChange={value => {
          this.handleRefresh({
            ...value,
          });
        }}
        onAdd={() => {
          dispatch({
            type: 'users/showModal',
            payload: {
              modalType: 'create',
            },
          });
        }}
      />
    );
  }

  renderList() {
    const { dispatch, users, loading } = this.props;
    const { list, pagination, selectedRowKeys } = users;

    console.log(this.props);
    return (
      <List
        dataSource={list}
        loading={loading.effects['users/query']}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: keys => {
            console.log('**** keys', keys);
            dispatch({
              type: 'users/updateState',
              payload: {
                selectedRowKeys: keys,
              },
            });
          },
        }}
        onEditItem={record => {
          dispatch({
            type: 'users/showModal',
            payload: {
              modalType: 'update',
              currentItem: record,
            },
          });
        }}
        onChange={page => {
          this.handleRefresh({
            page: page.current,
            per_page: page.pageSize,
          });
        }}
        onDeleteItem={id => {
          dispatch({
            type: 'users/delete',
            payload: id,
          }).then(() => {
            this.handleRefresh({
              page:
                list.length === 1 && pagination.current > 1
                  ? pagination.current - 1
                  : pagination.current,
            });
          });
        }}
      />
    );
  }

  renderModal() {
    const { dispatch, users, loading } = this.props;
    const { currentItem, modalVisible, modalType } = users;

    return (
      <Modal
        item={modalType === 'create' ? null : currentItem}
        visible={modalVisible}
        destroyOnClose={true}
        centered={true}
        maskClosable={false}
        confirmLoading={loading.effects[`users/${modalType}`]}
        title={`${modalType === 'create' ? 'Create User' : 'Update User'}`}
        onAccept={data => {
          dispatch({
            type: `users/${modalType}`,
            payload: data,
          }).then(() => {
            this.handleRefresh();
          });
        }}
        onCancel={() => {
          dispatch({
            type: 'users/hideModal',
          });
        }}
      />
    );
  }
  render() {
    const { users } = this.props;
    const { selectedRowKeys } = users;

    return (
      <Page inner={true}>
        {this.renderFilter()}
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={this.handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
        {this.renderList()}
        {this.renderModal()}
      </Page>
    );
  }
}

export default connect(({ users, loading }: IConnectState) => ({ users, loading }))(User);
