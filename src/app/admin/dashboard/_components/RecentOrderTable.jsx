"use client";

import { Input, Table, Tag } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search, Trash2 } from "lucide-react";

import { Eye } from "lucide-react";

import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { message } from "antd";

import OrderDetailsModal from "@/components/SharedModals/OrderDetailsModal";

// Dummy table Data
const data = Array.from({ length: 50 }).map((_, inx) => ({
    key: inx + 1,
    order_id: "HJ-0000",
    quantity: 1,
    product_type: "Physical Product",
    order_date: "11 oct 24, 11.10PM",
    customer_name: "Moazzem",
    amount: "$500",
    product_name: "Mobile",
    status: "Processing",
}));

export default function RecentOrderTable() {
    const [searchText, setSearchText] = useState("");
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    // Block user handler
    const handleBlockUser = () => {
        message.success(" Order delete  successfully");
    };

    // ================== Table Columns ================
    const columns = [
        {
            title: "Order Id",
            dataIndex: "order_id",
        },
        {
            title: "Customer Name",
            dataIndex: "customer_name",
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
        },
        // {
        //     title: "Order Date",
        //     dataIndex: "order_date",
        // },

        {
            title: "Status",
            dataIndex: "status",
            render: (value) => (
                <Tag color={value === "Processing" ? "blue" : "green"}>{value}</Tag>
            ),
        },
        {
            title: "Product Type",
            dataIndex: "product_type",
            render: (value) => (
                <Tag color={value === "Physical Product" ? "blue" : "green"}>
                    {value}
                </Tag>
            ),

        },
        // {
        //     title: "Action",
        //     render: () => (
        //         <div className="flex-center-start gap-x-3">
        //             <Tooltip title="Show Details">
        //                 <button onClick={() => setProfileModalOpen(true)}>
        //                     <Eye color="#1B70A6" size={22} />
        //                 </button>
        //             </Tooltip>

        //             <Tooltip title="Block User">
        //                 <CustomConfirm
        //                     title="Block User"
        //                     description="Are you sure to delete this order ?"
        //                     onConfirm={handleBlockUser}
        //                 >
        //                     <button>
        //                         <Trash2 color="#F16365" size={22} />
        //                     </button>
        //                 </CustomConfirm>
        //             </Tooltip>
        //         </div>
        //     ),
        // },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1B70A6",
                    colorInfo: "#1B70A6",
                },
            }}
        >
            {/* <div className="mb-3 ml-auto w-1/3 gap-x-5">
                <Input
                    placeholder="Search by name or email"
                    prefix={<Search className="mr-2 text-black" size={20} />}
                    className="h-11 !rounded-lg !border !text-base"
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div> */}
            <h1 className="text-xl font-semibold mb-2">
                Recent Orders
            </h1>
            <Table
                style={{ overflowX: "auto" }}
                columns={columns}
                dataSource={data}
                scroll={{ x: "100%" }}
            ></Table>

            <OrderDetailsModal
                open={profileModalOpen}
                setOpen={setProfileModalOpen}
            />
        </ConfigProvider>
    );
}
