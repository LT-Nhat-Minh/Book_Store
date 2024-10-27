import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  callFetchCategory,
  callUpdateBook,
  callUploadBook,
} from "../../../services/api";

function BookUpdateModal(props) {
  const [listCategory, setListCategory] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imgThumbnail, setImgThumbnail] = useState([]);
  const [imgSlider, setImgSlider] = useState([]);
  const [initForm, setInitForm] = useState({});
  const [loading, setLoading] = useState(false);

  const [form] = useForm();

  useEffect(() => {
    fetchCategory();
    if (props.book?._id) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          status: "done",
          name: props.book.thumbnail,
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            props.book.thumbnail
          }`,
        },
      ];

      const arrSlider = props.book.slider.map((item) => ({
        uid: uuidv4(),
        status: "done",
        name: item,
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      }));

      const init = {
        _id: props.book._id,
        mainText: props.book.mainText,
        author: props.book.author,
        category: props.book.category,
        price: props.book.price,
        sold: props.book.sold,
        quantity: props.book.quantity,
        thumbnail: arrThumbnail,
        slider: arrSlider,
      };
      setInitForm(init);
      setImgThumbnail(arrThumbnail);
      setImgSlider(arrSlider);
    }
  }, [props.book]);

  useEffect(() => {
    if (Object.keys(initForm).length > 0) {
      form.setFieldsValue(initForm);
    }
    return () => {
      form.resetFields();
    };
  }, [initForm]);

  const fetchCategory = async () => {
    const res = await callFetchCategory();
    if (res && res.data) {
      const list = res.data.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      setListCategory(list);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const onFinish = async (values) => {
    if (Object.keys(imgThumbnail).length <= 0) {
      notification.error({
        description: "Vui lòng thêm ảnh thumbnail",
        message: "Có lỗi xảy ra",
      });
      return;
    }
    if (imgSlider.length <= 0) {
      notification.error({
        description: "Vui lòng thêm ảnh slider",
        message: "Có lỗi xảy ra",
      });
      return;
    }
    values.thumbnail = imgThumbnail[0].name;
    values.slider = imgSlider.map((item) => {
      return item.name;
    });

    const res = await callUpdateBook(values);
    if (res && res.data) {
      message.success("Cập nhật thành công");
    } else {
      message.error("Đã có lỗi xảy ra");
    }
    props.setShowBookUpdate(false);
    form.resetFields();
  };

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBook(file);
    if (res && res.data) {
      setImgThumbnail([{ name: res.data.fileUploaded }]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBook(file);
    if (res && res.data) {
      setImgSlider((imgSlider) => [
        ...imgSlider,
        { name: res.data.fileUploaded },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setImgThumbnail([]);
    }
    if (type === "slider") {
      setImgSlider(imgSlider.filter((x) => x.uid !== file.uid));
    }
  };
  const handleChange = () => {};

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div>
      <Modal
        title="Thêm mới book"
        open={props.showBookUpdate}
        onOk={() => form.submit()}
        onCancel={() => {
          props.setShowBookUpdate(false);
          form.resetFields();
        }}
        width={750}
        keyboard={false}
      >
        <Divider />
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            hidden
            label="ID"
            name="_id"
            rules={[
              {
                required: true,
                message: "Vui lòng điền ID!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                span={12}
                label="Tên sách"
                name="mainText"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên sách!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                span={12}
                label="Tác giả"
                name="author"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên tác giả!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá bán"
                name="price"
                initialValue={"24"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên sách!",
                  },
                ]}
              >
                <InputNumber
                  addonAfter={"VND"}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  controls={false}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên sách!",
                  },
                ]}
              >
                <Select showSearch allowClear options={listCategory}></Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền tên sách!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số lượng!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Upload thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.thumbnail ?? []}
                >
                  <div>{uploadButton}</div>
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={() => {
                    setPreviewOpen(false);
                  }}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Upload slider"
                name="slider"
              >
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple={true}
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onChange={(info) => handleChange(info, "slider")}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                  defaultFileList={initForm?.slider ?? []}
                >
                  <div>{uploadButton}</div>
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={() => {
                    setPreviewOpen(false);
                  }}
                  width={"70%"}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default BookUpdateModal;
