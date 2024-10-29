import React, { useEffect, useState } from "react";
import BookSearch from "./BookSearch";
import { Button, Form, message, notification, Popconfirm, Table } from "antd";
import moment from "moment";
import { DeleteTwoTone, EditTwoTone, RedoOutlined } from "@ant-design/icons";
import { callDeleteBook, callFetchBook } from "../../../services/api";
import BookCreateModal from "./BookCreate";
import BookViewDetail from "./BookViewDetail";
import * as XLSX from "xlsx";
import BookUpdateModal from "./BookUpdate";

function BookManager(props) {
  const [pageSize, setPageSize] = useState(3);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [listBook, setListBook] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("sort=-updatedAt");
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [bookDetailData, setBookDetailData] = useState(null);
  const [showBookCreate, setShowBookCreate] = useState(false);
  const [showBookImport, setShowBookImport] = useState(false);
  const [showBookUpdate, setShowBookUpdate] = useState(false);
  const [bookIsUpdating, setBookIsUpdating] = useState(null);
  const [bookIsCreating, setBookIsCreating] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBook();
  }, [
    current,
    pageSize,
    searchQuery,
    sortField,
    showBookCreate,
    showBookUpdate,
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRefresh = (clearSearch) => {
    if (clearSearch) {
      setSearchQuery("");
      setCurrent(1);
      setSortField("");
    } else {
      setCurrent(1);
      setSortField("");
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(listBook);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Danh sách sản phẩm.csv");
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortField(q);
    }
    if (pagination && pagination.current !== current)
      setCurrent(pagination.current);
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const fetchBook = async () => {
    const query = `?current=${current}&pageSize=${pageSize}&${searchQuery}&${sortField}`;
    const res = await callFetchBook(query);
    if (res && res.data) {
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
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
              setBookDetailData(record);
              setShowBookDetail(true);
            }}
          >
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: true,
      render(text, record, index) {
        console.log(listBook);
        return moment(record.updatedAt).format("DD-MM-YYYY HH:mm:ss");
      },
    },
    {
      title: "Action",
      render(text, record, index) {
        const confirm = async () => {
          const res = await callDeleteBook(record._id);
          if (res && res.data) {
            message.success("Xóa thành công");
            fetchBook();
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
              title="Xóa sản phẩm"
              description="Bạn có chắc muốn xóa sản phẩm này không?"
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
                setBookIsUpdating(record);
                setShowBookUpdate(true);
              }}
            />
          </div>
        );
      },
    },
  ];
  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>Danh sách sản phẩm</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button type="primary" onClick={() => handleExport()}>
            Export
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowBookCreate(!showBookCreate);
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
  return (
    <div className="book_manager">
      <BookSearch
        handleSearch={handleSearch}
        handleRefresh={handleRefresh}
        setCurrent={setCurrent}
      />
      <Table
        title={renderHeader}
        columns={columns}
        dataSource={listBook}
        onChange={onChange}
        rowKey={(listBook) => listBook._id}
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
      <BookCreateModal
        showBookCreate={showBookCreate}
        setShowBookCreate={setShowBookCreate}
        bookIsCreating={bookIsCreating}
        setBookIsCreating={setBookIsCreating}
      />
      <BookViewDetail
        showBookDetail={showBookDetail}
        setShowBookDetail={setShowBookDetail}
        book={bookDetailData}
        setBookDetailData={setBookDetailData}
      />
      <BookUpdateModal
        showBookUpdate={showBookUpdate}
        setShowBookUpdate={setShowBookUpdate}
        book={bookIsUpdating}
        setBookIsUpdating={setBookIsUpdating}
      />
    </div>
  );
}

export default BookManager;
