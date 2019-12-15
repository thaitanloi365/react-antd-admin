import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input } from 'antd';
import { config } from 'utils';
import { IFormProps } from 'types';
import { IConnectProps, IConnectState } from 'models';
import styles from './index.less';

const FormItem = Form.Item;

interface ILoginProps extends IFormProps, IConnectProps, IConnectState {
  form: any;
}

class Login extends PureComponent<ILoginProps> {
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors: any, values: any) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  };

  render() {
    const { loading, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            <span>{config.siteName}</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input onPressEnter={this.handleOk} placeholder="Email" />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input type="password" onPressEnter={this.handleOk} placeholder="Password" />)}
            </FormItem>
            <Row>
              <Button type="primary" onClick={this.handleOk} loading={loading.effects.login}>
                Sign in
              </Button>
            </Row>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ loading }: IConnectState) => ({ loading }))(Form.create()(Login));
