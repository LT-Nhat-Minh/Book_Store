import { Button, Col, Form, Input, Row, Space, theme } from "antd";
import React from "react";

const AdvancedSearchForm = ({ onSubmit, onClear, setCurrent }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = (values) => {
    setCurrent(1);
    let query = "";
    if (values.mainText) {
      query += `&mainText=/${values.mainText}/i`;
    }
    if (values.email) {
      query += `&author=/${values.author}/i`;
    }
    if (values.phone) {
      query += `&category=/${values.catogory}/i`;
    }
    if (query) {
      onSubmit(query);
    }
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`mainText`}
            label={`Tên sách`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`author`} label={`Tác giả`}>
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`category`}
            label={`Thể loại`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
      </Row>
      <div
        style={{
          textAlign: "right",
        }}
      >
        <Space size="small">
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onClear(1);
            }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    </Form>
  );
};

function BookSearch(props) {
  return (
    <div>
      <AdvancedSearchForm
        onSubmit={props.handleSearch}
        onClear={props.handleRefresh}
        setCurrent={props.setCurrent}
      />
    </div>
  );
}

export default BookSearch;
