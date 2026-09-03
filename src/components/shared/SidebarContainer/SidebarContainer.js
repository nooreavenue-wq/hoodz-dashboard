"use client";

import "./Sidebar.css";
import logo from "@/assets/logos/logoforsideber.png";
import { logout, selectUser } from "@/redux/features/authSlice";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  House,
  CircleUser,
  Package,
  ShieldCheck,
  Wallet,
  Tags,
  Image as ImageIcon,
  SlidersVertical,
  ScrollText,
  Settings,
  ArrowLeftRight,
  BarChart3,
  Banknote,
  LogOut,
  Ticket,
  LayoutDashboard,
  ShoppingCart,
  MonitorSmartphone,
  MessageSquareWarning,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const SidebarContainer = ({ collapsed }) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = user?.role; // "admin" | "agent" | "vendor"
  const dispatch = useDispatch();
  const onClick = (e) => {
    if (e.key === "logout") {
      dispatch(logout());
      router.refresh();
      router.push("/login");
      toast.success("Logout successful");
    }
  };

  // ========== ADMIN LINKS ==========
  const adminLinks = [
    {
      key: "dashboard",
      icon: <House size={20} strokeWidth={2} />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "account-details",
      icon: <CircleUser size={20} strokeWidth={2} />,
      label: <Link href="/admin/account-details">Accounts Details</Link>,
    },
    {
      key: "order-details",
      icon: <Package size={20} strokeWidth={2} />,
      label: <Link href="/admin/order-details">Order Details</Link>,
    },
    {
      key: "kyc-details",
      icon: <ShieldCheck size={20} strokeWidth={2} />,
      label: <Link href="/admin/rider-kyc">KYC Verification</Link>,
    },
    {
      key: "wallet-transactions",
      icon: <Wallet size={20} strokeWidth={2} />,
      label: <Link href="/admin/wallet-transactions">Wallet Transactions</Link>,
    },
    {
      key: "vendor-payment",
      icon: <Wallet size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor-payment">Vendor Payment</Link>,
    },
    {
      key: "categories",
      icon: <Tags size={20} strokeWidth={2} />,
      label: <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: "campaign",
      icon: <ImageIcon size={20} strokeWidth={2} />,
      label: <Link href="/admin/campaign">Campaign Management</Link>,
    },
    {
      key: "banner",
      icon: <ImageIcon size={20} strokeWidth={2} />,
      label: <Link href="/admin/banner-management">Banner Management</Link>,
    },

    {
      key: "settings",
      icon: <SlidersVertical size={20} strokeWidth={2} />,
      label: "Settings",
      children: [
        {
          key: "privacy-policy-user",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/privacy-policy-user">
              Privacy Policy for User
            </Link>
          ),
        },
        {
          key: "terms-conditions-user",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/terms-conditions-user">T & C for User</Link>
          ),
        },
        {
          key: "privacy-policy-rider",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/privacy-policy-rider">
              Privacy Policy for Rider
            </Link>
          ),
        },
        {
          key: "terms-conditions-rider",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/terms-conditions-rider">T & C for Rider</Link>
          ),
        },
        {
          key: "privacy-policy-vendor",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/privacy-policy-vendor">
              Privacy Policy for Vendor
            </Link>
          ),
        },
        {
          key: "terms-conditions-vendor",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/terms-conditions-vendor">T & C for Vendor</Link>
          ),
        },
        {
          key: "privacy-policy-agent",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/privacy-policy-agent">
              Privacy Policy for Agent
            </Link>
          ),
        },
        {
          key: "terms-conditions-agent",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/terms-conditions-agent">T & C for Agent</Link>
          ),
        },
      ],
    },
    {
      key: "general-settings",
      icon: <Settings size={20} strokeWidth={2} />,
      label: <Link href="/admin/general-settings">General Settings</Link>,
    },
    {
      key: "all-transaction",
      icon: <ArrowLeftRight size={20} strokeWidth={2} />,
      label: <Link href="/admin/all-transaction">All Transaction</Link>,
    },
    {
      key: "analytics",
      icon: <BarChart3 size={20} strokeWidth={2} />,
      label: <Link href="/admin/analytics">Analytics</Link>,
    },
    {
      key: "withdrawals",
      icon: <Banknote size={20} strokeWidth={2} />,
      label: <Link href="/admin/withdrawals">Withdrawals</Link>,
    },
    {
      key: "logout",
      icon: <LogOut size={20} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];

  // ========== AGENT LINKS ==========
  const agentLinks = [
    {
      key: "order-details",
      icon: <Package size={20} strokeWidth={2} />,
      label: <Link href="/admin/order-details">Order Details</Link>,
    },
    {
      key: "deposit",
      icon: <Wallet size={20} strokeWidth={2} />,
      label: <Link href="/admin/agent/deposit">Deposit</Link>,
    },
    {
      key: "voucher",
      icon: <Ticket size={20} strokeWidth={2} />,
      label: <Link href="/admin/agent/voucher">Voucher</Link>,
    },
    {
      key: "grievance",
      icon: <MessageSquareWarning size={20} strokeWidth={2} />,
      label: <Link href="/admin/agent/grievance">Grievance</Link>,
    },
    {
      key: "Customer-Support",
      icon: <MessageSquareWarning size={20} strokeWidth={2} />,
      label: <Link href="/admin/agent/message">Customer Support</Link>,
    },
    {
      key: "Order-Support",
      icon: <MessageSquareWarning size={20} strokeWidth={2} />,
      label: <Link href="/admin/agent/order-support">Order Support</Link>,
    },
    {
      key: "unassigned-orders",
      icon: <MessageSquareWarning size={20} strokeWidth={2} />,
      label: (
        <Link href="/admin/agent/unassigned-orders">Unassigned Orders</Link>
      ),
    },
    {
      key: "settings",
      icon: <SlidersVertical size={20} strokeWidth={2} />,
      label: "Settings",
      children: [
        {
          key: "privacy-policy-agent",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: <Link href="/admin/agent/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "terms-conditions-agent",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/agent/terms-conditions">Terms & Conditions</Link>
          ),
        },
      ],
    },
    {
      key: "logout",
      icon: <LogOut size={20} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];
  // ========== VENDOR LINKS ==========
  const vendorLinks = [
    {
      key: "vendor-dashboard-overview",
      icon: <LayoutDashboard size={20} strokeWidth={2} />,
      label: (
        <Link href="/admin/vendor/vendor-dashboard-overview">
          Dashboard Overview
        </Link>
      ),
    },
    {
      key: "vendor-products",
      icon: <Package size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor/vendor-products">Products</Link>,
    },
    {
      key: "vendor-orders",
      icon: <ShoppingCart size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor/vendor-orders">Orders</Link>,
    },
    {
      key: "vendor-pos-system",
      icon: <MonitorSmartphone size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor/vendor-pos-system">POS System</Link>,
    },
    {
      key: "vendor-voucher",
      icon: <Ticket size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor/vendor-voucher">Voucher</Link>,
    },
    {
      key: "transaction-transaction",
      icon: <Ticket size={20} strokeWidth={2} />,
      label: <Link href="/admin/vendor/transaction">Transaction</Link>,
    },
    {
      key: "settings",
      icon: <SlidersVertical size={20} strokeWidth={2} />,
      label: "Settings",
      children: [
        {
          key: "privacy-policy-vendor",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: (
            <Link href="/admin/vendor/privacy-policy">Privacy Policy</Link>
          ),
        },
        {
          key: "terms-conditions-vendor",
          icon: <ScrollText size={18} strokeWidth={2} />,
          label: <Link href="/admin/vendor/terms-conditions">T & C</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <LogOut size={20} strokeWidth={2} />,
      label: <Link href="/login">Logout</Link>,
    },
  ];

  // ========== Role based links ==========
  const getNavLinks = () => {
    switch (role) {
      case "admin":
        return adminLinks;
      case "agent":
        return agentLinks;
      case "vendor":
        return vendorLinks;
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const currentPathname = usePathname()?.replace("/admin/", "")?.split(" ")[0];

  return (
    <Sider
      width={320}
      theme="light"
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        paddingInline: `${!collapsed ? "10px" : "4px"}`,
        paddingBlock: "30px",
        backgroundColor: "#FFFFFF",
        maxHeight: "100vh",
        overflow: "auto",
      }}
      className="scroll-hide"
    >
      <div className="mb-6 flex flex-col items-center justify-center gap-y-5">
        <Link href="">
          {collapsed ? (
            <Image src={logo} alt="Logo" className="h-4 w-auto" />
          ) : (
            <Image
              width={2000}
              height={2000}
              src={logo}
              alt="Logo"
              className="h-22 w-auto"
            />
          )}
        </Link>
      </div>

      <Menu
        onClick={onClick}
        defaultSelectedKeys={[currentPathname]}
        mode="inline"
        className="sidebar-menu space-y-2.5 !border-none !bg-transparent"
        items={navLinks}
      />
    </Sider>
  );
};

export default SidebarContainer;
