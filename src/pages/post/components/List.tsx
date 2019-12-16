import React, { PureComponent } from 'react';
import { Table } from 'antd';
import Link from 'umi/link';
import styles from './List.less';

class List extends PureComponent {
  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text: string, record: any) => <Link to={`post/${record.id}`}>{text}</Link>,
      },
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
      },
      {
        title: 'Owner',
        dataIndex: 'owner.name',
        key: 'owner',
        render: (text: string, record: any) => <Link to={`user/${record.owner_id}`}>{text}</Link>,
      },
    ];
    const { ...tableProps } = this.props;

    const paginationConfig = {
      ...tableProps.pagination,
      showTotal: total => `Total ${total} Items`,
    };

    return (
      <Table
        {...tableProps}
        pagination={paginationConfig}
        className={styles.table}
        bordered={true}
        columns={columns}
        rowKey={record => record.id}
      />
    );
  }
}

export default List;
