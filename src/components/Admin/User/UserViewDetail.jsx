import React, { useState } from "react";
import { Badge, Button, Descriptions, Drawer } from "antd";
import moment from "moment";
const UserViewDetail = (props) => {
  const {
    UserDetailData,
    setUserDetailData,
    ShowUserDetail,
    setShowUserDetail,
  } = props;

  const onClose = () => {
    setShowUserDetail(false);
    setUserDetailData(null);
  };
  return (
    <>
      <Drawer
        title="Info detail"
        onClose={onClose}
        open={ShowUserDetail}
        width="50vw"
      >
        <Descriptions title="User Info" column={2} bordered>
          <Descriptions.Item label="ID">
            {UserDetailData?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Username">
            {UserDetailData?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {UserDetailData?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {UserDetailData?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Role" span={2}>
            <Badge status="processing" text={UserDetailData?.role} />
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {moment(UserDetailData?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {moment(UserDetailData?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </>
  );
};
export default UserViewDetail;
