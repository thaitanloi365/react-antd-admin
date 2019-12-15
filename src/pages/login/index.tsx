import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Icon, Input } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

interface ILoginProps {
  loading: any;
  form: any;
  dispatch: any;
}

@connect(({ loading }) => ({ loading }))
@Form.create()
class Login extends PureComponent<ILoginProps> {
  handleOk = () => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
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
            <img
              alt="logo"
              src="data:image/png;base64,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"
            />
            <span>{'Admin'}</span>
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

export default Login;
