/* global window */
/* global document */
import React, { PureComponent, Fragment, Dispatch } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import { MyLayout } from 'components';
import { BackTop, Layout, Drawer } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { config, constants } from 'utils';
import Error from '../pages/404';
import styles from './PrimaryLayout.less';
import store from 'store';
import { ISiderProps } from 'components/Layout/Sider';
import { IHeaderProps } from 'components/Layout/Header';
import { RouteComponentProps } from 'react-router-dom';

const { Content } = Layout;
const { Header, Bread, Sider } = MyLayout;

export interface IPrimaryLayoutProps extends Partial<RouteComponentProps> {
  dispatch: Dispatch<any>;
  app: {
    theme: 'light' | 'dark';
    collapsed: boolean;
    notifications: Array<any>;
  };
  loading: Object;
}

class PrimaryLayout extends PureComponent<IPrimaryLayoutProps> {
  state = {
    isMobile: false,
  };
  enquireHandler: any;

  componentDidMount() {
    this.enquireHandler = enquireScreen((mobile: boolean) => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  onCollapseChange = (collapsed: boolean) => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    });
  };

  render() {
    const { app, location, dispatch, children } = this.props;
    console.log('*** props', this.props);
    const { theme, collapsed, notifications } = app || {};
    const user = store.get('user') || {};
    const token = store.get('token') || '';
    const { isMobile } = this.state;
    const { onCollapseChange } = this;

    // Query whether you have permission to enter this page
    const hasPermission = token !== '';

    // MenuParentId is equal to -1 is not a available menu.
    const menus = constants.menus.filter(_ => _.menuParentId !== '-1');

    const headerProps: IHeaderProps = {
      menus,
      collapsed,
      notifications,
      onCollapseChange,
      avatar: user.avatar,
      username: user.username,
      fixed: config.fixedHeader,
      onAllNotificationsRead() {
        dispatch({ type: 'app/allNotificationsRead' });
      },
      onSignOut() {
        dispatch({ type: 'app/signOut' });
      },
      user,
    };

    const siderProps: ISiderProps = {
      theme,
      menus,
      isMobile,
      collapsed,
      onCollapseChange,
      onThemeChange(theme: 'light' | 'dark') {
        dispatch({
          type: 'app/handleThemeChange',
          payload: theme,
        });
      },
    };

    return (
      <Fragment>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={200}
              style={{
                padding: 0,
                height: '100vh',
              }}
            >
              <Sider {...siderProps} collapsed={false} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div
            className={styles.container}
            style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
            id="primaryLayout"
          >
            <Header {...headerProps} />
            <Content className={styles.content}>
              <Bread routeList={constants.menus} />
              {hasPermission ? children : <Error />}
            </Content>
            <BackTop
              className={styles.backTop}
              target={() => document.querySelector('#primaryLayout') as HTMLHtmlElement}
            />
            <GlobalFooter className={styles.footer} copyright={config.copyright} />
          </div>
        </Layout>
      </Fragment>
    );
  }
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(PrimaryLayout));
