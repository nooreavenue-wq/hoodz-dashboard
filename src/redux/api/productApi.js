import { baseApi } from "./baseApi";

const ProductApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, searchText = "", stockFilter } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          searchTerm: searchText || "",
        });

        if (stockFilter) {
          params.append("stockFilter", stockFilter);
        }

        return {
          url: `/products/my-products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),
    getSingleProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/products",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // get all products for admin
    getAllProducts: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/products?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
} = ProductApi;
