import React, {useState, useMemo} from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Divider } from 'antd';
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@ant-design/icons';
import { Button, Divider, notification, Space } from 'antd'
import { CallRegister } from "../../services/api";
import "./style.scss"

const Context = React.createContext({
  name: 'Default',
});

function Register(props) {
  const {isSubmit, setIsSubmit} = useState(false);
  const onFinish = async (values) => {
    const {fullName, email, password, phone} = values;
    setIsSubmit(true);
    const res = await CallRegister(values);
    if(res?.data?._id){

    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    api.info({
      message: `Notification ${placement}`,
      description: <Context.Consumer>{({ name }) => `Hello, ${name}!`}</Context.Consumer>,
      placement,
    });
  };
  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );
  return (
    <div style={{margin: "auto"}}>
      <div style={{textAlign: "center"}}>
        <h1>Đăng ký người dùng mới</h1>
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
          label="Họ và tên"
          name="fullname"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền tên!',
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

        <Form.Item
          label="Số điện thoại"
          name="phonenumber"
          rules={[
            {
              required: true,
              message: 'Vui lòng điền số điện thoại!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
          style={{display: "flex", justifyContent: "center"}}
        >
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
        </Form.Item>
        <Divider plain>Or</Divider>
        <div style={{display: "flex", float: "right"}}>
        <p>Đã có tài khoản?</p><a href="/login" style={{margin: "auto 20px"}}>Đăng nhập</a>
        </div>
      </Form>
      <Context.Provider value={contextValue}>
      {contextHolder}
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification('topRight')}
          icon={<RadiusUprightOutlined />}
        >
          topRight
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button
          type="primary"
          onClick={() => openNotification('bottomLeft')}
          icon={<RadiusBottomleftOutlined />}
        >
          bottomLeft
        </Button>
        <Button
          type="primary"
          onClick={() => openNotification('bottomRight')}
          icon={<RadiusBottomrightOutlined />}
        >
          bottomRight
        </Button>
      </Space>
    </Context.Provider>
    </div>
  );
}

export default Register;