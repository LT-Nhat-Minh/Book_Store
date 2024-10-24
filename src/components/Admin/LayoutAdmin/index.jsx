import React from "react";
import { useSelector } from "react-redux";
import AdminHeader from "../Header";
import AdminSideBar from "../SiderBar";
import { Outlet } from "react-router-dom";
import AdminFooter from "../Footer";

const LayoutAdmin = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role;

  return (
    <div className="layout-app">
      <div style={{ display: "flex", position: "relative" }}>
        {isAdminRoute && userRole === "ADMIN" && <AdminSideBar />}
        <div className="admin_content">
          {isAdminRoute && userRole === "ADMIN" && <AdminHeader />}
          <Outlet />
          {isAdminRoute && userRole === "ADMIN" && <AdminFooter />}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
