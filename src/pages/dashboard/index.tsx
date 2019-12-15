import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Page } from 'components';
import styles from './index.less';
import store from 'store';

interface IDashboardProps {
  dashboard: Object;
  loading: Object;
}

@connect(({ app, dashboard, loading }) => ({
  dashboard,
  loading,
}))
class Dashboard extends PureComponent<IDashboardProps> {
  render() {
    const userDetail = store.get('user') || {};
    const { avatar, username } = userDetail;
    const { dashboard, loading } = this.props;
    const { quote, recentSales, comments, browser } = dashboard;

    return <Page className={styles.dashboard}></Page>;
  }
}

export default Dashboard;
