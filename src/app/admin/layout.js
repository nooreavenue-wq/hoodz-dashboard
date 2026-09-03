"use client";

import HeaderContainer from "@/components/shared/HeaderContainer/HeaderContainer";
import SidebarContainer from "@/components/shared/SidebarContainer/SidebarContainer";
import { useMediaQuery } from "@react-hook/media-query";
import { Layout } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const { Content } = Layout;

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if small screen
  const screenSizeLessThan1300 = useMediaQuery(
    "only screen and (max-width: 1300px)",
  );

  // Show prompt to collapse sidebar if screen size is less than 1300px
  useEffect(() => {
    if (screenSizeLessThan1300 && !sidebarCollapsed) {
      toast.success(
        "Small screen detected! If content doesn't fit better please collapse the sidebar by clicking the menu button on top-left",
        {
          duration: 2500,
        },
      );
    }
  }, [screenSizeLessThan1300, sidebarCollapsed]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <SidebarContainer collapsed={sidebarCollapsed}></SidebarContainer>

      <Layout>
        <HeaderContainer
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        ></HeaderContainer>

        <Content
          style={{
            height: "100vh",
            maxHeight: "100vh",
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            paddingInline: "30px",
            paddingTop: "30px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
