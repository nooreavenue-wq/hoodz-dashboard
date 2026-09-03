"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Image,
  Tag,
  ConfigProvider,
  Tooltip,
} from "antd";
import { Search, Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import {
  useGetCampainsQuery,
  useDeleteCampainMutation,
} from "@/redux/api/bannerApi";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CampaignFormModal from "./CampaignFormModal";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function CampaignContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data, isLoading } = useGetCampainsQuery({
    page,
    limit,
    searchText,
  });

  const [deleteCampain] = useDeleteCampainMutation();

  const campaigns = data?.data || [];

  const handleDelete = async (id) => {
    try {
      const res = await deleteCampain(id).unwrap();
      toast.success(res?.message || "Campaign deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      title: "Campaign",
      dataIndex: "title",
      render: (v) => (
        <div className="flex items-center gap-2">
          <Megaphone size={16} className="text-[#1B70A6]" />
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      render: (products) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(products || []).slice(0, 4).map((p) => (
              <Image
                alt={p.title}
                key={p._id}
                src={p.banner}
                width={36}
                height={36}
                className="rounded-lg border-2 border-white object-cover"
                preview={false}
              />
            ))}
          </div>
          <Tag color="blue">{products?.length || 0} items</Tag>
        </div>
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
            title="Delete Campaign"
            description="This will permanently delete the campaign."
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
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <p className="text-sm text-slate-500">
            Manage product campaigns for banners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search campaigns..."
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
            Add Campaign
          </Button>
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={campaigns}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} campaigns`,
        }}
      />

      <CampaignFormModal
        open={formOpen}
        setOpen={setFormOpen}
        editData={editData}
      />
    </ConfigProvider>
  );
}
