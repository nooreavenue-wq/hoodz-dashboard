import { baseApi } from "./baseApi";

const CategoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/category?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),
    createCategory: build.mutation({
      query: (payload) => ({
        url: "/category",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: build.mutation({
      query: ({ id, payload }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = CategoriesApi;
