const { baseApi } = require("./baseApi");

const WithDrawalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWithdrawals: builder.query({
      query: (params) => ({
        url: "/withdraws",
        method: "GET",
        params,
      }),
      providesTags: ["withdrawals"],
    }),

    getWithdrawalById: builder.query({
      query: (id) => ({
        url: `/withdraws/${id}`,
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),

    chnageWithdrawalStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/withdraws/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["withdrawals"],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useChnageWithdrawalStatusMutation,
  useGetWithdrawalByIdQuery,
} = WithDrawalApi;
