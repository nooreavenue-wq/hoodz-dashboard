"use client";

import { Button, Pagination, Spin, Empty, message } from "antd";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/redux/api/categoriesApi";
import toast from "react-hot-toast";

export default function CategoryContainer() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, isLoading } = useGetCategoriesQuery({
    page,
    limit: 12,
    searchText: "",
  });

  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.data || [];

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id).unwrap();
      toast.success(res?.message || "Category deleted");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowEdit(true);
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        className="!w-full !py-6"
        onClick={() => setShowCreate(true)}
      >
        Create Category
      </Button>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20">
          <Empty description="No categories found" />
        </div>
      ) : (
        <section className="my-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex flex-col items-center rounded-xl border border-primary-blue/25 p-4 shadow transition hover:shadow-md"
            >
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {category.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.icon}
                    alt={category.title}
                    className="h-20 w-20 object-contain"
                  />
                ) : (
                  <span className="text-3xl text-slate-300">?</span>
                )}
              </div>

              <h4 className="mb-5 mt-3 text-center text-xl font-semibold">
                {category.title}
              </h4>

              <div className="flex w-full gap-3">
                <CustomConfirm
                  title="Delete Category"
                  description="Are you sure you want to delete this category?"
                  onConfirm={() => handleDelete(category._id)}
                >
                  <Button danger className="w-full">
                    Delete
                  </Button>
                </CustomConfirm>

                <Button
                  type="primary"
                  className="w-full"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </section>
      )}

      {data?.meta?.totalPage > 1 && (
        <div className="my-10 flex justify-end">
          <Pagination
            current={page}
            total={data?.meta?.total || 0}
            pageSize={12}
            onChange={(p) => setPage(p)}
          />
        </div>
      )}

      <CreateCategoryModal open={showCreate} setOpen={setShowCreate} />

      <EditCategoryModal
        open={showEdit}
        setOpen={setShowEdit}
        category={selectedCategory}
      />
    </div>
  );
}
