import {
  BarChartOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

function AdminSideBar() {
  const navigate = useNavigate();
  const items = [
    {
      key: "#",
      icon: <BarChartOutlined />,
      label: "Dashboard",
    },
    {
      key: "CRUD",
      label: "Manage Users",
      icon: <UserOutlined />,
    },
    {
      key: "book",
      label: "Manage Book",
      icon: <ShoppingOutlined />,
    },
    {
      key: "order",
      icon: <ShoppingCartOutlined />,
      label: "Manage Order",
    },
  ];
  return (
    <div style={{ height: "100vh", float: "left" }}>
      <h3 style={{ padding: "30px 0", textAlign: "center" }}>Admin</h3>
      <Menu
        style={{
          width: 256,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        items={items}
        onClick={({ key }) => {
          navigate(`/admin/${key}`);
        }}
        mode="inline"
      />
    </div>
  );
}

export default AdminSideBar;
