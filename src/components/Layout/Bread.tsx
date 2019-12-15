import React, { PureComponent, Fragment } from 'react';
import { Breadcrumb, Icon } from 'antd';
import Link from 'umi/navlink';
import withRouter from 'umi/withRouter';
import { pathMatchRegexp, queryAncestors } from 'utils';
import { RouteComponentProps } from 'react-router-dom';
import { IMenus } from 'types';
import styles from './Bread.less';

interface IBreadProps extends Partial<RouteComponentProps> {
  routeList: IMenus;
}

@withRouter
class Bread extends PureComponent<IBreadProps> {
  generateBreadcrumbs = (paths: IMenus) => {
    return paths.map((item, key) => {
      const content = item && (
        <Fragment>
          {item.icon && <Icon type={item.icon} style={{ marginRight: 4 }} />}
          {item.name}
        </Fragment>
      );

      return (
        item && (
          <Breadcrumb.Item key={key}>
            {paths.length - 1 !== key ? <Link to={item.route || '#'}>{content}</Link> : content}
          </Breadcrumb.Item>
        )
      );
    });
  };
  render() {
    const { routeList, location } = this.props;

    // Find a route that matches the pathname.
    const currentRoute = routeList.find(
      _ => _.route && pathMatchRegexp(_.route, location.pathname),
    );

    // Find the breadcrumb navigation of the current route match and all its ancestors.
    const paths = currentRoute
      ? queryAncestors(routeList, currentRoute, 'breadcrumbParentId').reverse()
      : [
          routeList[0],
          {
            id: 404,
            name: 'Not Found',
          },
        ];

    return <Breadcrumb className={styles.bread}>{this.generateBreadcrumbs(paths)}</Breadcrumb>;
  }
}

export default Bread;
