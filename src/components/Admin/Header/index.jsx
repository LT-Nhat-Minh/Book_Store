import React from "react";
import "../style.scss";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown, message, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { callLogout } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../../redux/account/accountSlice";
function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);
  const itemsDropdown = [
    {
      label: <label style={{ cursor: "pointer" }}>Trang chủ</label>,
      key: "home",
      onClick: () => navigate("/"),
    },
    {
      label: <label style={{ cursor: "pointer" }}>Quản lí tài khoản</label>,
      key: "account",
      onClick: () => navigate("/"),
    },
    {
      label: <label style={{ cursor: "pointer" }}>Đăng xuất</label>,
      key: "logout",
      onClick: () => handleLogout(),
    },
  ];

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  return (
    <div>
      <div className="admin_header">
        <div>Dieu huong</div>
        <div
          className="account"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <Avatar src={`http://localhost:8080/images/avatar/${user.avatar}`} />
          <Dropdown
            menu={{
              items: itemsDropdown,
            }}
            trigger={["click"]}
          >
            <Space className="space">{user?.fullName}</Space>
          </Dropdown>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default AdminHeader;
