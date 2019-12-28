import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Page } from 'components';
import { IConnectState } from 'models';
import { Card, Avatar, Col, Row } from 'antd';
import { formatDate } from 'utils/date';
import styles from './index.less';

interface IUserDetailProps extends IConnectState {}

class UserDetail extends PureComponent<IUserDetailProps> {
  renderRow(title: string, value: any) {
    return (
      <Row className={styles.content}>
        <Col span={8}>{title}</Col>
        <Col span={16}>{value}</Col>
      </Row>
    );
  }
  render() {
    const { userDetails } = this.props;
    const { data } = userDetails;

    return (
      <Page inner>
        <Col xs={{ span: 20, offset: 2 }} lg={{ span: 10, offset: 7 }}>
          <Card>
            <Row type="flex" justify="center" align="middle" style={{ marginBottom: '32px' }}>
              <Avatar size={64} src={data?.avatar} />
            </Row>
            {this.renderRow('Name', data?.name)}
            {this.renderRow('Email', data?.email)}
            {this.renderRow('Phone', data?.phone)}
            {this.renderRow('Created at', formatDate(data?.created_at))}
          </Card>
        </Col>
      </Page>
    );
  }
}

export default connect(({ userDetails }: IConnectState) => ({ userDetails }))(UserDetail);
