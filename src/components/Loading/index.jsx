import { HashLoader } from "react-spinners";

const Loading = () => {
  return (
    <>
      <HashLoader
        color="#2dd3ca"
        size="100"
        style={{
          position: "fixed",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
        }}
      />
    </>
  );
};

export default Loading;
