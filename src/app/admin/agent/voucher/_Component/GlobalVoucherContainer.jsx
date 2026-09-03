"use client";

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Tag,
  Image,
  Switch,
  Tooltip,
  ConfigProvider,
  Empty,
} from "antd";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  useGetGlobalVoucherQuery,
  useDeleteVoucherMutation,
  useChangeVoucherStatusMutation,
} from "@/redux/api/voucherApi";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import AddGlobalVoucherModal from "./AddGlobalVoucherModal";
import EditGlobalVoucherModal from "./EditGlobalVoucherModal";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import VoucherDetailsModal from "@/app/admin/vendor/vendor-voucher/_Compnent/VoucherDetailsModal";

export default function GlobalVoucherContainer({ limit = 10 }) {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

  const { data, isLoading, isFetching, isError, error } =
    useGetGlobalVoucherQuery({
      page,
      limit,
      searchText,
    });

  const [deleteVoucher] = useDeleteVoucherMutation();
  const [changeStatus, { isLoading: toggling }] =
    useChangeVoucherStatusMutation();

  const vouchers = data?.data || [];

  const handleDelete = async (id) => {
    try {
      const res = await deleteVoucher(id).unwrap();
      toast.success(res?.message || "Voucher deleted");
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  const handleToggle = async (id, current) => {
    const next = current === "active" ? "deactivated" : "active";
    try {
      const res = await changeStatus({ id, status: next }).unwrap();
      toast.success(res?.message || "Status updated");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      render: (v) => (
        <span className="font-mono font-semibold text-[#1B70A6]">{v}</span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (v, r) => (
        <div className="flex items-center gap-2">
          {r.discountType === "gift" && r.giftDetails?.bannerImage?.[0] && (
            <Image
              src={r.giftDetails.bannerImage[0]}
              width={36}
              alt="banner"
              height={36}
              className="rounded object-cover"
            />
          )}
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "discountType",
      render: (v) => <Tag className="capitalize">{v}</Tag>,
    },
    {
      title: "Value",
      render: (_, r) => {
        if (r.discountType === "gift") return r.giftDetails?.name || "Gift";
        if (r.discountType === "percentage") return `${r.discountValue}%`;
        return `$${r.discountValue}`;
      },
    },
    {
      title: "Min Spend",
      dataIndex: "minSpend",
      render: (v) => `$${v ?? 0}`,
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value, record) => (
        <div className="flex items-center gap-2">
          <Tag
            color={value === "active" ? "green" : "default"}
            className="capitalize"
          >
            {value}
          </Tag>
          <Switch
            size="small"
            checked={value === "active"}
            loading={toggling}
            onChange={() => handleToggle(record._id, value)}
          />
        </div>
      ),
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View">
            <button
              onClick={() => {
                setDetailsId(record._id);
                setDetailsOpen(true);
              }}
            >
              <Eye size={18} color="#1B70A6" />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              onClick={() => {
                setEditId(record._id);
                setEditOpen(true);
              }}
            >
              <Pencil size={18} color="#64748b" />
            </button>
          </Tooltip>
          <CustomConfirm
            title="Delete Voucher"
            description="Are you sure?"
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

  if (isError) {
    return (
      <div className="py-20">
        <Empty
          description={error?.data?.message || "Failed to load vouchers"}
        />
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Global Vouchers</h2>
          <p className="text-sm text-slate-500">Platform-wide discount codes</p>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Search vouchers..."
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
            onClick={() => setAddOpen(true)}
          >
            Add Global Voucher
          </Button>
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={vouchers}
        loading={isLoading || isFetching}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} vouchers`,
        }}
      />

      <AddGlobalVoucherModal open={addOpen} setOpen={setAddOpen} />
      <EditGlobalVoucherModal
        open={editOpen}
        setOpen={setEditOpen}
        voucherId={editId}
      />
      <VoucherDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        voucherId={detailsId}
      />
    </ConfigProvider>
  );
}
