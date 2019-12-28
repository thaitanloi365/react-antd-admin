import React, { PureComponent } from 'react';
import { Table, Modal, Avatar } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';
import { DropOption } from 'components';
import Link from 'umi/link';
import styles from './List.less';
import { IUser } from 'types';
import { formatDate } from 'utils/date';
const { confirm } = Modal;

interface IListProps extends TableProps<IUser> {
  onDeleteItem: (recordId: string | number) => void;
  onEditItem: (record: IUser) => void;
  // location: Location;
  // tableProps: TableProps<IUser>
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

    const columns: Array<ColumnProps<IUser>> = [
      {
        title: 'Avatar',
        key: 'avatar',
        dataIndex: 'avatar',
        width: 72,
        fixed: 'left',
        render: text => <Avatar style={{ marginLeft: 8 }} src={text} />,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`users/${record.id}`}>{text}</Link>,
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
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => <span>{formatDate(text)}</span>,
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
        bordered={true}
        scroll={{ x: 1200 }}
        columns={columns}
        rowKey={record => `${record.id}`}
      />
    );
  }
}

export default List;
