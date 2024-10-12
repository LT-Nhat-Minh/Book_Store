import React, { useState, useMemo } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Divider,
  notification,
  Space,
  message,
  InputNumber,
} from "antd";
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import { callRegister } from "../../services/api";
import "./style.scss";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const onFinish = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callRegister(fullName, email, password, phone);
    setIsSubmit(false);
    if (res?.data?._id) {
      message.success({
        content: "Đăng ký thành công!",
      });
      navigate("/login");
    } else {
      notification.error({
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        placement: "topRight",
        message: "Có lỗi xảy ra",
        showProgress: true,
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ margin: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Đăng ký người dùng mới</h1>
        <hr />
      </div>
      <Form
        className="formContainer"
        name="basic"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: 550,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng điền tên!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng điền email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng điền mật khẩu!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              type: "number",
              required: true,
              message: "Vui lòng điền số điện thoại!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} controls={false} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
        </Form.Item>
        <Divider plain>Or</Divider>
        <div style={{ display: "flex", float: "right" }}>
          <p>Đã có tài khoản?</p>
          <a href="/login" style={{ margin: "auto 20px" }}>
            Đăng nhập
          </a>
        </div>
      </Form>
    </div>
  );
}

export default Register;
