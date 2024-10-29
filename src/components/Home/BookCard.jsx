import { Card, Col, Rate, Row } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useEffect, useState } from "react";
import { callUpdateBook } from "../../services/api";
import Title from "antd/es/typography/Title";

function BookCard(props) {
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    getThumbnailURL();
  }, []);
  const getThumbnailURL = async () => {
    console.log(props.book.thumbnail);
    const url = `${import.meta.env.VITE_BACKEND_URL}/images/book/${
      props.book.thumbnail
    }`;
    setThumbnail(url);
  };
  return (
    <div className={"book_card"}>
      <Card hoverable cover={<img alt="example" src={thumbnail} />}>
        <div className={"content"}>
          <Title ellipsis={{ rows: "3" }} style={{ fontSize: "24px" }}>
            {props.book.mainText}
          </Title>
          <span style={{ fontSize: "24px" }}>{props.book.price} &#8363;</span>
          <span>Số lượng {props.book.quantity}</span>
          <div className="last_content">
            <div>
              <Rate disabled defaultValue={5} style={{ fontSize: "15px" }} />
            </div>
            <div>&nbsp; Đã bán {props.book.sold}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BookCard;
