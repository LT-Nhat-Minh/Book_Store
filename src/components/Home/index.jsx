import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Modal,
  Pagination,
  Row,
  Space,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import { callFetchBook, callFetchCategory } from "../../services/api";
import { useForm } from "antd/es/form/Form";
import BookCard from "./BookCard";
import aqp from "api-query-params";
import "./style.scss";

function Home() {
  const [listBook, setListBook] = useState();
  const [pageSize, setPageSize] = useState(12);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [priceQuery, setPriceQuery] = useState("");
  const [sortField, setSortField] = useState("sort=-sold");
  const [listCategory, setListCategory] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [form] = useForm();
  const [form_mobile] = useForm();

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, categoryQuery, priceQuery, sortField]);

  const fetchBook = async () => {
    const query = `?current=${current}&pageSize=${pageSize}&${categoryQuery}&${priceQuery}&${sortField}`;
    const resBook = await callFetchBook(query);
    if (resBook && resBook.data) {
      setListBook(resBook);
      setTotal(resBook.data.meta.total);
    }
    const resCategory = await callFetchCategory();
    if (resCategory && resCategory.data) {
      setListCategory(resCategory);
    }
  };

  const onChangeCategory = (values) => {
    setCategoryQuery("category=" + values);
  };

  const onValuesChange = (values) => {
    if (values.category && values.category.length > 0)
      setCategoryQuery(`category=${values?.category}`);
  };

  const onChangeTab = (activeKey) => {
    setSortField("sort=" + activeKey);
  };

  const onFinish = (values) => {
    const minPrice = values?.minPrice || 0;
    const maxPrice = values?.maxPrice || 0;
    setPriceQuery(
      `&price>=${minPrice}${maxPrice == 0 ? "" : `&price<=${maxPrice}`}`
    );
    setIsFilterModalOpen(false);
    form.resetFields("maxPrice", "minPrice");
  };

  const onReset = () => {
    setPriceQuery("");
  };

  const tabItems = [
    {
      key: "-sold",
      label: "Phổ biến",
    },
    {
      key: "-createdAt",
      label: "Hàng mới",
    },
    {
      key: "price",
      label: "Giá thấp đến cao",
    },
    {
      key: "-price",
      label: "Giá cao đến thấp",
    },
  ];

  const handleFilter_mobile = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className={"home_page"}>
      <Row align="top" style={{ width: "100%" }}>
        <Col
          xs={0}
          sm={0}
          md={0}
          lg={0}
          xl={5}
          style={{
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            borderRadius: "0 24px 24px 0",
            padding: "0 24px",
            marginRight: "24px",
          }}
        >
          <div className={"form_filter"}>
            <div className="filter_header">
              <div style={{ display: "flex" }}>
                <FilterOutlined />
                <h2>&nbsp; Bộ lọc tìm kiếm</h2>
              </div>{" "}
            </div>
            <div className={"filter-category"}>
              <Divider />
              <Form
                form={form}
                labelCol={{ span: 24 }}
                onFinish={onFinish}
                onValuesChange={onValuesChange}
              >
                <div>
                  <p style={{ fontSize: "24px", textIndent: "30px" }}>
                    Thể loại
                  </p>
                  <Form.Item name="category">
                    <Checkbox.Group
                      options={listCategory.data}
                      onChange={onChangeCategory}
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
                      <Form.Item name="minPrice">
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          controls={false}
                          min={0}
                          style={{ width: "100%" }}
                          placeholder="Từ"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="maxPrice">
                        <InputNumber
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          controls={false}
                          min={0}
                          style={{ width: "100%" }}
                          placeholder="Đến"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Space className={"filter-button"}>
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
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={18}
          style={{
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            borderRadius: "24px",
            width: "100% !important",
          }}
        >
          <span>
            <Tabs
              defaultActiveKey="1"
              items={tabItems}
              size={"large"}
              style={{ padding: "10px 50px" }}
              onChange={onChangeTab}
            />
          </span>
          <div className={"filter_button_mobile"}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              iconPosition={"end"}
              onClick={() => setIsFilterModalOpen(true)}
            >
              Bộ lọc
            </Button>
          </div>
          <Modal
            title="Bộ lọc"
            okText={"Tìm kiếm"}
            cancelText={"Xóa"}
            open={isFilterModalOpen}
            onOk={() => form_mobile.submit()}
            onCancel={() => {
              setIsFilterModalOpen(false);
              form_mobile.resetFields(["minPrice", "maxPrice"]);
              form_mobile.submit();
            }}
          >
            <Form
              form={form_mobile}
              labelCol={{ span: 24 }}
              onFinish={onFinish}
            >
              <div>
                <p style={{ fontSize: "24px", textIndent: "30px" }}>Thể loại</p>
                <Form.Item name="category">
                  <Checkbox.Group
                    options={listCategory.data}
                    onChange={onChangeCategory}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  />
                </Form.Item>
                <p style={{ fontSize: "24px", textIndent: "30px" }}>
                  Lọc theo giá
                </p>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item name="minPrice">
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        controls={false}
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Từ"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="maxPrice">
                      <InputNumber
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        controls={false}
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Đến"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </Modal>
          <div style={{ width: "100%" }} className={"space_container_book"}>
            <Space style={{ width: "100%" }}>
              <Row
                gutter={[24, 24]}
                style={{ margin: "auto", width: "100%" }}
                type="flex"
                wrap={true}
                justify={"start"}
              >
                {listBook?.data?.result?.map((item) => (
                  <Col
                    key={item._id}
                    xs={{ span: 12, style: { width: "480px" } }}
                    sm={{ span: 8, style: { width: "576px" } }}
                    md={{ span: 6, style: { width: "768px" } }}
                    xl={{ span: 6, style: { width: "1200px" } }}
                    xxl={{ span: 4, style: { width: "1600px" } }}
                    className={"card"}
                  >
                    <BookCard book={item} />
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
          <Pagination
            defaultCurrent={1}
            pageSize={12}
            total={total}
            align="end"
            style={{ margin: "50px 100px" }}
            responsive={true}
            onChange={(page) => {
              setCurrent(page);
              console.log(listBook.data.meta.total);
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
