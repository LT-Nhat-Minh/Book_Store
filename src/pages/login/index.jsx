import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Divider } from "antd";
import "./style.scss"

function Login() {

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div style={{margin: "auto"}}>
      <div style={{textAlign: "center"}}>
        <h1>Đăng nhập</h1>
        <hr />
      </div>
      <Form className="formContainer"
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền email!',
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
              message: 'Vui lòng điền mật khẩu!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
          style={{display: "flex", justifyContent: "center"}}
        >
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
        <Divider plain>Or</Divider>
        <div style={{display: "flex", float: "right"}}>
        <p>Chưa có tài khoản?</p><a href="/register" style={{margin: "auto 20px"}}>Đăng ký</a>
        </div>
        
      </Form>
    </div>
  );
}

export default Login;