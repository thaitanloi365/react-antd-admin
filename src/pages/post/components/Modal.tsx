import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Radio, Modal } from 'antd';
import { IFormProps } from 'types';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps {
  type: string;
  item: any;
  onOk: Function;
  form: any;
}

class PostModal extends PureComponent<IModalProps> {
  handleOk = () => {
    const { item = {}, onOk, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      };
      data.address = data.address.join(' ');
      onOk(data);
    });
  };

  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Title" hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: item.title,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={'Content'} hasFeedback {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: item.content,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Tags" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tags', {
              initialValue: item.tags,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PostModal);
