const { baseApi } = require("./baseApi");

const FinancialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsData: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/payments?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
    }),
    getWithdrawalRequests: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/withdraw?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["withdrawalRequests"],
    }),
    updateWithdrawalRequest: builder.mutation({
      query: (payload) => ({
        url: `/withdraw/status/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["withdrawalRequests"],
    }),
    deniedWithdrawalRequest: builder.mutation({
      query: (id) => ({
        url: `/withdraw/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["withdrawalRequests"],
    }),

    getRefundRequests: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/refunds?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["refundRequests"],
    }),
    updateRefundRequest: builder.mutation({
      query: (payload) => ({
        url: `/refunds/status/${payload.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["refundRequests"],
    }),
    deniedRefundRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/refunds/${id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["refundRequests"],
    }),
  }),
});

export const {
  useGetTransactionsDataQuery,
  useGetWithdrawalRequestsQuery,
  useUpdateWithdrawalRequestMutation,
  useDeniedWithdrawalRequestMutation,
  useGetRefundRequestsQuery,
  useUpdateRefundRequestMutation,
  useDeniedRefundRequestMutation,
} = FinancialApi;
