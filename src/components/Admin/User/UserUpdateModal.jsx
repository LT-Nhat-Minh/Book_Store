import { Form, Input, message, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { callUpdateUser } from "../../../services/api";

function UserUpdateModal({
  showUserUpdate,
  setShowUserUpdate,
  user,
  setUserIsUpdating,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  const handleSubmit = async (values) => {
    const { _id, fullName, phone } = values;
    const res = await callUpdateUser(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật người dùng thành công!");
      setShowUserUpdate(false);
      setUserIsUpdating(null);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  return (
    <div>
      <Modal
        title="Cập nhật thông tin người dùng"
        open={showUserUpdate}
        onOk={() => form.submit()}
        onCancel={() => {
          setUserIsUpdating(null);
          setShowUserUpdate(false);
        }}
        maskClosable={false}
      >
        <Form
          form={form}
          className="ant-advanced-search-form"
          onSubmit={{}}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            hidden
            label="ID"
            name="_id"
            rules={[
              {
                required: true,
                message: "Please input your ID",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên người dùng mới"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên người dùng",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
              {
                required: true,
                message: "Vui lòng nhập email",
              },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserUpdateModal;
