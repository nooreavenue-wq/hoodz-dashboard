import { ConfigProvider } from "antd";
import { Spin } from "antd";

export default function loading() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="h-[75vh] flex-center">
        <Spin size="large" />
      </div>
    </ConfigProvider>
  );
}
