import React, { PureComponent } from 'react';

import { Page } from 'components';
import styles from './index.less';

interface IDashboardProps {
  dashboard: Object;
  loading: Object;
}

class Dashboard extends PureComponent<IDashboardProps> {
  render() {
    return <Page className={styles.dashboard}></Page>;
  }
}

export default Dashboard;
