import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Page } from 'components';
import { IConnectState } from 'models';
import styles from './index.less';

interface IUserDetailProps extends IConnectState {}

class UserDetail extends PureComponent<IUserDetailProps> {
  render() {
    const { userDetails } = this.props;
    const { data } = userDetails;

    const content = [];
    for (let key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>{String(data[key])}</div>
          </div>,
        );
      }
    }
    return (
      <Page inner>
        <div className={styles.content}>{content}</div>
      </Page>
    );
  }
}

export default connect(({ userDetails }: IConnectState) => ({ userDetails }))(UserDetail);
