import { DeleteTwoTone, EditTwoTone, RedoOutlined } from "@ant-design/icons";
import { Button, Form, message, notification, Popconfirm, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { callDeleteUser, callFetchUser } from "../../../services/api";
import InputSearch from "./InputSearch";
import UserCreateModal from "./UserCreate";
import UserImportModal from "./UserImport";
import UserUpdateModal from "./UserUpdateModal";
import UserViewDetail from "./UserViewDetail";

function UserManager() {
  const [pageSize, setPageSize] = useState(3);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [userDetailData, setUserDetailData] = useState(null);
  const [showUserCreate, setShowUserCreate] = useState(false);
  const [showUserImport, setShowUserImport] = useState(false);
  const [showUserUpdate, setShowUserUpdate] = useState(false);
  const [userIsUpdating, setUserIsUpdating] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUser();
  }, [
    current,
    pageSize,
    searchQuery,
    sortField,
    showUserCreate,
    showUserImport,
    showUserUpdate,
  ]);

  const fetchUser = async () => {
    const query = `?current=${current}&pageSize=${pageSize}&${searchQuery}&${sortField}`;
    const res = await callFetchUser(query);
    setIsLoading(true);
    if (res && res.data) {
      setListUser(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = (clearSearch) => {
    if (clearSearch) {
      setCurrent("1");
      setSearchQuery("");
      setSortField("");
    } else {
      setCurrent("1");
      setSortField("");
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(listUser);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ExportData.csv");
  };

  const handleDelete = () => {};

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Danh sách người dùng</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button type="primary" onClick={() => handleExport()}>
            Export
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowUserImport(!showUserImport);
            }}
          >
            Import
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowUserCreate(!showUserCreate);
            }}
          >
            Thêm mới
          </Button>
          <Button onClick={() => handleRefresh(0)}>
            <RedoOutlined />
          </Button>
        </span>
      </div>
    );
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortField(q);
    }
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render(text, record, index) {
        return (
          <a
            href="#"
            onClick={() => {
              setUserDetailData(record);
              setShowUserDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render(text, record, index) {
        return (
          <span>{moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</span>
        );
      },
      sorter: true,
    },
    {
      title: "Action",
      render(text, record, index) {
        const confirm = async () => {
          const res = await callDeleteUser(record._id);
          if (res && res.data) {
            message.success("Xóa thành công");
            fetchUser();
          } else {
            notification.error({
              message: "Đã có lỗi xảy ra",
              description: res.message,
            });
          }
        };
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <Popconfirm
              placement="leftBottom"
              title="Xóa người dùng"
              description="Bạn có chắc muốn xóa người dùng này không?"
              onConfirm={confirm}
              okText="Xóa"
              cancelText="Không"
            >
              <DeleteTwoTone
                twoToneColor={"#ff3b3b"}
                style={{ fontSize: "20px", cursor: "pointer" }}
              />
            </Popconfirm>

            <EditTwoTone
              twoToneColor={"#1777ff"}
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => {
                setUserIsUpdating(record);
                setShowUserUpdate(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="user">
      <InputSearch
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
        setCurrent={setCurrent}
      />
      <Table
        title={renderHeader}
        columns={columns}
        dataSource={listUser}
        onChange={onChange}
        rowKey={(listUser) => listUser._id}
        sortDirections={["ascend", "descend", "ascend"]}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "10", "20", "30", "40", "50"],
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
      />
      <UserViewDetail
        UserDetailData={userDetailData}
        setUserDetailData={setUserDetailData}
        ShowUserDetail={showUserDetail}
        setShowUserDetail={setShowUserDetail}
      />
      <UserCreateModal
        showUserCreate={showUserCreate}
        setShowUserCreate={setShowUserCreate}
        fetchUser={fetchUser}
      />
      <UserImportModal
        showUserImport={showUserImport}
        setShowUserImport={setShowUserImport}
      />
      <UserUpdateModal
        showUserUpdate={showUserUpdate}
        setShowUserUpdate={setShowUserUpdate}
        user={userIsUpdating}
        setUserIsUpdating={setUserIsUpdating}
      />
    </div>
  );
}

export default UserManager;
