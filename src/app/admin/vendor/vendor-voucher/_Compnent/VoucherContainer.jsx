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
import { useSelector } from "react-redux";

import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";

import VoucherDetailsModal from "./VoucherDetailsModal";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { selectToken } from "@/redux/features/authSlice";
import {
  useChangeVoucherStatusMutation,
  useDeleteVoucherMutation,
  useGetVoucherQuery,
} from "@/redux/api/voucherApi";
import { jwtDecode } from "jwt-decode";
import AddVoucherModal from "./AddVoucherModal";
import EditVoucherModal from "./EditVoucherModal";

const statusColors = {
  active: "green",
  deactivated: "default",
  expired: "red",
};

const discountColors = {
  fixed: "blue",
  percentage: "purple",
  gift: "orange",
};

export default function VoucherContainer({ limit = 10 }) {
  const user = useSelector(selectToken);
  const decoded = user ? jwtDecode(user) : null;
  const userId = decoded ? decoded.userId : null;
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { data, isLoading } = useGetVoucherQuery(
    {
      page,
      limit,
      searchText,
      id: userId,
    },
    { skip: !userId },
  );

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

  if (!userId) {
    return (
      <div className="py-20">
        <Empty description="User not found. Please login again." />
      </div>
    );
  }

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
              height={36}
              className="rounded object-cover"
              alt="product"
            />
          )}
          <span className="font-medium">{v}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "discountType",
      render: (v) => (
        <Tag color={discountColors[v] || "default"} className="capitalize">
          {v}
        </Tag>
      ),
    },
    {
      title: "Value",
      render: (_, r) => {
        if (r.discountType === "gift") {
          return r.giftDetails?.name || "Gift";
        }
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
          <Tag color={statusColors[value] || "default"} className="capitalize">
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

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1B70A6" } }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search vouchers..."
          prefix={<Search size={16} className="text-slate-400" />}
          className="h-11 max-w-sm !rounded-lg"
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
            setEditId(null);
            setAddOpen(true);
          }}
        >
          Add Voucher
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={vouchers}
        loading={isLoading || !userId}
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.total || 0,
          onChange: setPage,
          showTotal: (t) => `Total ${t} vouchers`,
        }}
      />

      {/* <VoucherFormModal
        open={formOpen}
        setOpen={setFormOpen}
        voucherId={editId}
      /> */}

      <VoucherDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        voucherId={detailsId}
      />

      <AddVoucherModal open={addOpen} setOpen={setAddOpen} />
      <EditVoucherModal
        open={editOpen}
        setOpen={setEditOpen}
        voucherId={editId}
      />
    </ConfigProvider>
  );
}
