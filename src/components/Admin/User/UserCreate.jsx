import {
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
} from "antd";
import React, { useState } from "react";
import { callCreateAUser } from "../../../services/api";

function UserCreateModal(props) {
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinished = async (values) => {
    const { fullName, email, password, phone } = values;
    setIsSubmit(true);
    const res = await callCreateAUser(fullName, email, password, phone);
    if (res?.data?._id) {
      message.success({
        content: "Đăng ký thành công!",
      });
      form.resetFields();
      props.setShowUserCreate(false);
      await props.fetchUser();
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
    form.resetFields();
    setIsSubmit(false);
  };

  return (
    <div>
      <Modal
        title="Thêm người dùng"
        open={props.showUserCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          props.setShowUserCreate(false);
          form.resetFields();
        }}
        maskClosable={false}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
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
          onFinish={onFinished}
          autoComplete="off"
        >
          <Form.Item
            label="Tên người dùng"
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
            <Input />
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
        </Form>
      </Modal>
    </div>
  );
}

export default UserCreateModal;
