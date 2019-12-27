import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IPost } from 'types';
import { ICurrentItem } from 'models/posts';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

interface IModalProps extends IFormProps, ModalProps {
  item: ICurrentItem;
  onAccept: (item: IPost) => void;
}

interface IModelState {
  imageFile: File | null;
}

class PostModal extends PureComponent<IModalProps> {
  state: IModelState = {
    imageFile: null,
  };

  handleOk = () => {
    const { onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
      };

      onAccept(data);
    });
  };

  render() {
    const { item, onOk, form, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Title" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: item?.title,
            })(<Input />)}
          </FormItem>
          <FormItem label="Content" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: item?.content,
            })(<Input />)}
          </FormItem>
          <FormItem label="Tag" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('tag', {
              initialValue: item?.tag,
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(PostModal);
