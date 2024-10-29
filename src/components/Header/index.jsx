import {
  DownOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Badge, Button, Dropdown, Input, message, Space } from "antd";
import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo3.png";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
const { Search } = Input;

const Header = () => {
  const [isDisplayed, setIsDisplay] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);

  const handleDropDown = () => {
    setIsDisplay((isDisplayed) => !isDisplayed);
  };

  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.data) {
      dispatch(doLogoutAction());
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  useEffect(() => {}, []);

  const items = [
    ...(isAuthenticated && user.role === "ADMIN"
      ? [
          {
            label: <label style={{ cursor: "pointer" }}>Trang quản trị</label>,
            key: "manager",
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
    {
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
      key: "account",
      onClick: () => navigate("/"),
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),

      key: "logout",
      onClick: () => handleLogout(),
    },
  ];

  return (
    <div>
      <div className="header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="" />
            <p>Booki</p>
          </a>
        </div>
        <div className="searchBar">
          <Search
            placeholder="input search loading with enterButton"
            enterButton
          />
          <div className="cart">
            <Badge count={100}>
              <ShoppingCartOutlined style={{ fontSize: "30px" }} />
            </Badge>
          </div>
        </div>
        <div className="navigation">
          <hr style={{ height: "30px" }} />
          <div className="account">
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar
                    style={{ margin: "0 10px" }}
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                      user.avatar
                    }`}
                  />
                  <Space>{user?.fullName}</Space>
                </a>
              </Dropdown>
            ) : (
              <p onClick={() => navigate("/login")}>Đăng nhập</p>
            )}
          </div>
        </div>
        <div className="searchBar_tablet">
          <Search
            placeholder="input search loading with enterButton"
            enterButton
          />
          <div className="cart">
            <Badge count={100}>
              <ShoppingCartOutlined style={{ fontSize: "30px" }} />
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
