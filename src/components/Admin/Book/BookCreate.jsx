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
import React, { useEffect, useState } from "react";
import {
  callCreateBook,
  callFetchCategory,
  callUploadBook,
} from "../../../services/api";
import { Description } from "@mui/icons-material";

function BookCreateModal(props) {
  const [listCategory, setListCategory] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgThumbnail, setImgThumbnail] = useState({});
  const [imgSlider, setImgSlider] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategory();
  }, [props.showBookCreate]);

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
    values.thumbnail = imgThumbnail.name;
    values.slider = imgSlider.map((item) => {
      return item.name;
    });

    const res = await callCreateBook(values);
    if (res && res.data) {
      message.success("Tạo sách mới thành công");
    } else {
      message.error("Đã có lỗi xảy ra");
    }
    props.setShowBookCreate(false);
    form.resetFields();
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const fetchCategory = async () => {
    const res = await callFetchCategory();
    if (res && res.data) {
      const d = res.data.map((item) => {
        return { label: item, value: item };
      });
      setListCategory(d);
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

  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setImgThumbnail({});
    }
    if (type === "slider") {
      setImgSlider(() => imgSlider.filter((x) => x.uid !== file.uid));
    }
  };

  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBook(file);
    if (res && res.data) {
      setImgThumbnail({ name: res.data.fileUploaded, uid: file.uid });
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file!");
    }
  };
  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadBook(file);
    if (res && res.data) {
      setImgSlider((imgSlider) => [
        ...imgSlider,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra khi upload file!");
    }
  };

  const handleChange = (info, type) => {};

  const handlePreview = async (file, type) => {
    if (type === "slider") {
      imgSlider.map((item) => {
        if (item.uid == file.uid) {
          setPreviewImage(
            `${import.meta.env.VITE_BACKEND_URL}/images/book/${item.name}`
          );
        }
      });
    }

    if (type === "thumbnail") {
      setPreviewImage(
        `${import.meta.env.VITE_BACKEND_URL}/images/book/${imgThumbnail.name}`
      );
    }

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
        title="Tạo sách mới"
        open={props.showBookCreate}
        onOk={() => form.submit()}
        onCancel={() => {
          props.setShowBookCreate(false);
          form.resetFields();
          setImgSlider([]);
          setImgThumbnail({});
        }}
        width={750}
        keyboard={false}
      >
        <Divider />
        <Form form={form} onFinish={onFinish}>
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
                <Select
                  defaultValue={null}
                  showSearch
                  allowClear
                  options={listCategory}
                ></Select>
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
                  onPreview={(file) => handlePreview(file, "thumbnail")}
                >
                  <div>{uploadButton}</div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Upload thumbnail"
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
                  onPreview={(file) => handlePreview(file, "slider")}
                >
                  <div>{uploadButton}</div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={() => {
            setPreviewOpen(false);
          }}
          width={"70%"}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Modal>
    </div>
  );
}

export default BookCreateModal;
