import {
  Badge,
  Descriptions,
  Divider,
  Drawer,
  Image,
  Modal,
  Table,
  Upload,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function BookViewDetail(props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (props.book) {
      let imgThumbnail = {};
      let imgSlider = [];
      if (props.book.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: props.book.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            props.book.thumbnail
          }`,
        };
      }
      if (props.book.slider && props.book.slider.length > 0) {
        props.book.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [props.book]);

  const handlePreview = async (file) => {
    setPreviewImage(file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  return (
    <div>
      <Drawer
        title="Chi tiết sản phẩm"
        onClose={() => {
          props.setShowBookDetail(false);
          props.setBookDetailData(null);
        }}
        open={props.showBookDetail}
        width={"50vw"}
      >
        <Descriptions title={props.book?.mainText} column={2} bordered>
          <Descriptions.Item label="ID" span={2}>
            {props.book?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại">
            {props.book?.category}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {props.book?.author}
          </Descriptions.Item>
          <Descriptions.Item label="Giá" span={2}>
            <span>{props.book?.price} &#8363;</span>
          </Descriptions.Item>
          <Descriptions.Item label="Tồn kho">
            {props.book?.quantity}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {props.book?.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Tình trạng" span={2}>
            {props.book?.quantity > 0 ? (
              props.book.quantity > 10 ? (
                <Badge status="processing" text="Còn hàng" />
              ) : (
                <Badge status="warning" text="Sắp hết" />
              )
            ) : (
              <Badge status="error" text="Hết hàng" />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(props.book?.createdAt).format("DD-MM-YY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {moment(props.book?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions title={"Ảnh mô tả sản phẩm"} />
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        />
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
      </Drawer>
    </div>
  );
}

export default BookViewDetail;
