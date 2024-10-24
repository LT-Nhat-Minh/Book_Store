import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, notification, Table, Upload } from "antd";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { callImportUser } from "../../../services/api";
import Sample from "./ImportSample.xlsx?url";

function UserImportModal(props) {
  const [jsonData, setJsonData] = useState([]);

  const handleImport = async () => {
    const data = jsonData.map((item) => {
      item.password = "123456";
      return item;
    });
    console.log(">>>item", data);
    const res = await callImportUser(data);
    if (res && res.data) {
      notification.success({
        description: `Thành công: ${res.data.countSuccess}, Lỗi: ${res.data.countError}`,
        message: "Import thành công",
      });
      props.setShowUserImport(false);
      setJsonData(false);
    } else {
      notification.error({
        description: "Đã có lỗi xảy ra",
        message: "Import không thành công",
      });
    }
    // if(res && res.data)
  };
  const { Dragger } = Upload;
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj;
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = function (e) {
            const data = new Uint8Array(reader.result);

            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets.Sheet1;

            //convert to json
            const json = XLSX.utils.sheet_to_json(worksheet, {
              header: ["fullName", "email", "phone"],
              range: 1, //skip header
            });
            if (json && json.length > 0) {
              setJsonData(json);
            }
          };
        }
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "email",
      key: "address",
    },
  ];
  return (
    <div>
      <Modal
        title="Import User"
        open={props.showUserImport}
        onOk={() => handleImport()}
        okText="Import"
        okButtonProps={{
          disabled: jsonData.length < 1,
        }}
        onCancel={() => {
          props.setShowUserImport(false);
          setJsonData([]);
        }}
        maskClosable={false}
        width="50vw"
        style={{ maxWidth: "1200px" }}
      >
        <Dragger {...propsUpload} showUploadList={jsonData.length > 0}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files. &nbsp;
            <a href={Sample} onClick={(e) => e.stopPropagation()} download>
              Download Sample File
            </a>
          </p>
        </Dragger>
        <Table
          columns={columns}
          dataSource={jsonData}
          rowKey={(jsonData) => jsonData.email}
          title={() => <div>Dữ liệu cần upload:</div>}
          style={{ marginTop: "50px" }}
        />
      </Modal>
    </div>
  );
}

export default UserImportModal;
