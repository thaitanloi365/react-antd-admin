import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Helmet } from 'react-helmet';
import { Loader } from 'components';
import { queryLayout } from 'utils';
import NProgress from 'nprogress';
import config from 'utils/config';
import withRouter from 'umi/withRouter';
import { RouteComponentProps } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import PrimaryLayout from './PrimaryLayout';
import './BaseLayout.less';

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout,
};

interface IBaseLayoutProps extends RouteComponentProps {
  loading: any;
}

class BaseLayout extends PureComponent<IBaseLayoutProps, any> {
  previousPath = '';
  render() {
    const { loading, children, location } = this.props;
    const Container = LayoutMap[queryLayout(config.layouts, location.pathname)];

    const currentPath = location.pathname + location.search;
    if (currentPath !== this.previousPath) {
      NProgress.start();
    }

    if (!loading.global) {
      NProgress.done();
      this.previousPath = currentPath;
    }

    return (
      <Fragment>
        <Helmet>
          <title>{config.siteName}</title>
        </Helmet>
        <Loader fullScreen spinning={loading.effects['app/query']} />
        <Container>{children}</Container>
      </Fragment>
    );
  }
}

export default withRouter(connect(({ loading }: IBaseLayoutProps) => ({ loading }))(BaseLayout));
