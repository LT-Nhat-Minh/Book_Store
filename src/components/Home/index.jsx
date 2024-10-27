import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Pagination,
  Row,
  Space,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import { callFetchBook, callFetchCategory } from "../../services/api";
import { useForm } from "antd/es/form/Form";
import BookCard from "./BookCard";

function Home() {
  const [listBook, setListBook] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [form] = useForm();

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    const resBook = await callFetchBook("");
    if (resBook && resBook.data) {
      setListBook(resBook);
    }

    const resCategory = await callFetchCategory();
    if (resCategory && resCategory.data) {
      setListCategory(resCategory);
    }
    console.log(resBook);
    console.log(resCategory);
  };

  const onCategoryChange = () => {};

  const onFinish = (values) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const tabItems = [
    {
      key: "1",
      label: "Phổ biến",
    },
    {
      key: "2",
      label: "Hàng mới",
    },
    {
      key: "3",
      label: "Bán chạy",
    },
  ];

  return (
    <div>
      <Row align="top" style={{ width: "100%" }}>
        <Col
          md={4}
          sm={0}
          xs={0}
          style={{
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            borderRadius: "24px",
            padding: "0 24px",
            margin: "0 auto",
          }}
        >
          <div className={"form-filter"}>
            <div className="header">
              <div style={{ display: "flex" }}>
                <FilterOutlined />
                <h2>&nbsp; Bộ lọc tìm kiếm</h2>
              </div>{" "}
            </div>
            <div className={"filter-category"}>
              <Divider />
              <Form form={form} labelCol={{ span: 24 }} onFinish={onFinish}>
                <div>
                  <p style={{ fontSize: "24px", textIndent: "30px" }}>
                    Thể loại
                  </p>
                  <Form.Item name="category">
                    <Checkbox.Group
                      options={listCategory.data}
                      defaultValue={["Apple"]}
                      onChange={onCategoryChange}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    />
                  </Form.Item>
                </div>

                <div style={{ width: "200px", margin: "auto" }}>
                  <Divider />
                </div>
                <div>
                  <p style={{ fontSize: "24px", textIndent: "30px" }}>
                    Lọc theo giá
                  </p>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="minPrice"
                        label={"Từ"}
                        labelCol={{ span: 4 }}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          controls={false}
                          min={0}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="maxPrice"
                        label={"Đến"}
                        labelCol={{ span: 4 }}
                      >
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          controls={false}
                          min={0}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Space style={{ float: "right", marginRight: "40px" }}>
                      <Button type="primary" htmlType="submit">
                        Tìm kiếm
                      </Button>
                      <Button htmlType="button" onClick={onReset}>
                        Xóa
                      </Button>
                    </Space>
                  </Form.Item>
                </div>
              </Form>
            </div>
          </div>
        </Col>
        <Col
          md={19}
          sm={24}
          xs={24}
          style={{
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            margin: "0 auto",
          }}
        >
          <Tabs defaultActiveKey="1" items={tabItems} size={"large"} />
          <Space>
            <Row gutter={24}>
              {listBook?.data?.map((item) => (
                <Col key={item._id} span={{ xs: 3 }}>
                  <BookCard book={item} />
                </Col>
              ))}
            </Row>
          </Space>
          <Pagination
            defaultCurrent={1}
            total={50}
            align="end"
            style={{ margin: "50px 100px" }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
