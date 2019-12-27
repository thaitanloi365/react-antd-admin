import React, { Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { IFormProps, IFilter } from 'types';

interface IFilterProps extends IFormProps {
  onAdd: () => void;
  filter: IFilter;
}

class Filter extends Component<IFilterProps> {
  handleSearch = (event: any) => {
    event.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  onCreate = () => {};

  render() {
    const { form, onAdd } = this.props;
    const { getFieldDecorator } = form;
    // const { name } = filter;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Row gutter={24}>
        <Col md={12}>
          <Form {...formItemLayout} onSubmit={this.handleSearch}>
            <Row gutter={8}>
              <Col md={{ span: 14 }}>
                <Form.Item>{getFieldDecorator('search')(<Input placeholder="Search" />)}</Form.Item>
              </Col>
              <Col md={{ span: 5 }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Col>
              <Col md={{ span: 5 }}>
                <Button type="danger" htmlType="submit">
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={12} style={{ textAlign: 'right' }}>
          <Button type="default" onClick={onAdd}>
            Create
          </Button>
        </Col>
      </Row>
    );
  }
}

const FilterForm = Form.create<IFilterProps>()(Filter);

export default FilterForm;
