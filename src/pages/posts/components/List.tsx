import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { IPost } from 'types';
import styles from './List.less';

interface IListProps extends TableProps<IPost> {}

class List extends PureComponent<IListProps> {
  colums: Array<ColumnProps<IPost>> = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: 'Owner ID',
      key: 'owner_id',
      dataIndex: 'owner_id',
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Content',
      key: 'content',
      dataIndex: 'content',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
    },
  ];

  render() {
    const { ...tableProps } = this.props;
    return (
      <Table
        className={styles.table}
        {...tableProps}
        columns={this.colums}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => `Total ${total} Items`,
        }}
      />
    );
  }
}

export default List;
