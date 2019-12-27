import React, { PureComponent } from 'react';
import { Form, Input, Modal, Row } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { IFormProps, IUser } from 'types';
import { ImageUpload } from 'components';
import { ICurrentItem } from 'models/users';

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
  onAccept: (item: IUser) => void;
}

interface IModelState {
  imageFile: File | null;
}
class UserModal extends PureComponent<IModalProps, IModelState> {
  state: IModelState = {
    imageFile: null,
  };

  handleOk = () => {
    const { imageFile } = this.state;
    const { item, onAccept, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields((errors: any) => {
      if (errors) {
        return;
      }
      const data: any = {
        ...getFieldsValue(),
        imageFile,
        id: item?.id,
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
          <Row type="flex" justify="center">
            <div>
              <ImageUpload
                defaultImageURL={item?.avatar}
                onImageLoaded={file => this.setState({ imageFile: file })}
              />
            </div>
          </Row>
          <FormItem label="Name" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item?.name,
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Phone" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: item?.phone,
              // rules: [
              //   {
              //     required: true,
              //     pattern: /^1[34578]\d{9}$/,
              //     message: 'The input is not valid phone!',
              //   },
              // ],
            })(<Input />)}
          </FormItem>
          <FormItem label="Email" hasFeedback={true} {...formItemLayout}>
            {getFieldDecorator('email', {
              initialValue: item?.email,
              rules: [
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  message: 'The input is not valid E-mail!',
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create<IModalProps>()(UserModal);
