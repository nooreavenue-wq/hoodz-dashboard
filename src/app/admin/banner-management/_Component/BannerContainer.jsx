"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Image,
  Tag,
  Switch,
  ConfigProvider,
  Tooltip,
} from "antd";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGetBannersQuery,
  useBanerStatusToggleMutation,
  useDeleteBannerMutation,
} from "@/redux/api/bannerApi";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import BannerFormModal from "./BannerFormModal";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const typeColors = {
  product: "blue",
  shop: "green",
  campain: "purple",
};

export default function BannerContainer({ limit = 12 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data, isLoading } = useGetBannersQuery({
    page,
    limit,
    searchText,
  });

  const [toggleStatus] = useBanerStatusToggleMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = data?.data || [];

  const handleToggle = async (id) => {
    try {
      const res = await toggleStatus(id).unwrap();
      toast.success(res?.message || "Status updated");
    } catch (e) {
      toast.error(e?.data?.message || "Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteBanner(id).unwrap();
      toast.success(res?.message || "Banner deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      title: "Banner",
      dataIndex: "banner",
      render: (url) => (
        <Image
          src={url}
          alt="banner"
          width={120}
          height={56}
          className="rounded-lg object-cover"
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (v) => (
        <Tag color={typeColors[v] || "default"} className="capitalize">
          {v === "campain" ? "Campaign" : v}
        </Tag>
      ),
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (v) => <Tag className="capitalize">{v}</Tag>,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (v) => (
        <span className="font-mono text-xs text-slate-500">
          {v ? `${String(v).slice(0, 10)}…` : "—"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          checkedChildren="Active"
          unCheckedChildren="Off"
          onChange={() => handleToggle(record._id)}
        />
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Action",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <button
              onClick={() => {
                setEditData(record);
                setFormOpen(true);
              }}
            >
              <Pencil size={18} color="#64748b" />
            </button>
          </Tooltip>
          <CustomConfirm
            title="Delete Banner"
            description="Remove this banner?"
            onConfirm={() => handleDelete(record._id)}
          >
            <button>
              <Trash2 size={18} color="#ef4444" />
            </button>
          </CustomConfirm>
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Banners</h2>
          <p className="text-sm text-slate-500">
            Product / Shop / Campaign banners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search banners..."
            prefix={<Search size={16} className="text-slate-400" />}
            className="h-11 max-w-xs !rounded-lg"
            allowClear
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
          <Button
            type="primary"
            size="large"
            icon={<Plus size={18} />}
            onClick={() => {
              setEditData(null);
              setFormOpen(true);
            }}
            className="h-11"
          >
            Add Banner
          </Button>
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={banners}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} banners`,
        }}
      />

      <BannerFormModal
        open={formOpen}
        setOpen={setFormOpen}
        editData={editData}
      />
    </ConfigProvider>
  );
}
