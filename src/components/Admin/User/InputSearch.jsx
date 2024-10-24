import { Button, Col, Form, Input, Row, Select, Space, theme } from "antd";
import React from "react";
const { Option } = Select;

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
    // console.log("Received values of form: ", values);
    setCurrent(1);
    let query = "";
    if (values.fullName) {
      query += `&fullName=/${values.fullName}/i`;
    }
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.phone) {
      query += `&phone=/${values.phone}/i`;
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
          <Form.Item labelCol={{ span: 24 }} name={`fullName`} label={`Tên`}>
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item labelCol={{ span: 24 }} name={`Email`} label={`Email`}>
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={`Phone`}
            label={`Số điện thoại`}
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
              onClear();
            }}
          >
            Xóa
          </Button>
        </Space>
      </div>
    </Form>
  );
};
const InputSearch = ({ handleSearch, handleRefresh, setCurrent }) => {
  return (
    <>
      <AdvancedSearchForm
        onSubmit={handleSearch}
        onClear={handleRefresh}
        setCurrent={setCurrent}
      />
    </>
  );
};
export default InputSearch;
