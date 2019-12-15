import React, { PureComponent } from 'react';
import { Table, Modal, Avatar } from 'antd';
import { DropOption } from 'components';
import Link from 'umi/link';
import styles from './List.less';

const { confirm } = Modal;

interface IListProps {
  onDeleteItem: Function;
  onEditItem: Function;
  location: Location;
}

class List extends PureComponent<IListProps> {
  handleMenuClick = (record: any, e: any) => {
    const { onDeleteItem, onEditItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props;

    const columns = [
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 72,
        fixed: 'left',
        render: (text: string) => <Avatar style={{ marginLeft: 8 }} src={text} />,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: any) => <Link to={`user/${record.id}`}>{text}</Link>,
      },
      {
        title: 'NickName',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Gender',
        dataIndex: 'isMale',
        key: 'isMale',
        render: (text: 'Male' | 'Female') => <span>{text ? 'Male' : 'Female'}</span>,
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'CreateTime',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        render: (text: string, record: any) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: 'Update' },
                { key: '2', name: 'Delete' },
              ]}
            />
          );
        },
      },
    ];

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => `Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    );
  }
}

export default List;
