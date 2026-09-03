import { baseApi } from "./baseApi";

const PosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPos: builder.query({
      query: ({ page = 1, limit = 10, searchText = "" } = {}) => ({
        url: `/pos-orders?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["pos"],
    }),
    addPosOrder: builder.mutation({
      query: (payload) => ({
        url: "/pos-orders",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["pos"],
    }),
    deletePostOrder: builder.mutation({
      query: (id) => ({
        url: `/pos-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pos"],
    }),
    viewSingleOrderDetails: builder.query({
      query: (id) => ({
        url: `/pos-orders/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPosQuery,
  useAddPosOrderMutation,
  useDeletePostOrderMutation,
  useViewSingleOrderDetailsQuery,
} = PosApi;
