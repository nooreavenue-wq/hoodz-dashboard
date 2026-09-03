import { baseApi } from "./baseApi";

const OrderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/orders?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getVendorOrders: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/orders/author-orders?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    orderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    getSingleOrderDetails: build.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // vendor order confirm and proccess api

    makeOrderConfirm: build.mutation({
      query: ({ id }) => ({
        url: `/orders/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    makeOrderProccess: build.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/processing`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    // get Unassigned Orders
    getUnassignedOrders: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/orders?page=${page}&limit=${limit}&searchTerm=${searchText}&hasRiderAssigned=false`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetVendorOrdersQuery,
  useOrderStatusMutation,
  useGetSingleOrderDetailsQuery,
  useGetUnassignedOrdersQuery,
  useMakeOrderConfirmMutation,
  useMakeOrderProccessMutation,
} = OrderApi;
