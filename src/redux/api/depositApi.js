import { baseApi } from "./baseApi";

const DepositApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeposits: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/deposits?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Deposits"],
    }),
    getSingleDeposit: builder.query({
      query: (id) => ({
        url: `/deposits/${id}`,
        method: "GET",
      }),
      providesTags: ["Deposits"],
    }),
    changeDepositStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/deposits/verify/${id}`,
        method: "PATCH",
        body: payload, // { status, note }
      }),
      invalidatesTags: ["Deposits"],
    }),
  }),
});

export const {
  useGetDepositsQuery,
  useGetSingleDepositQuery,
  useChangeDepositStatusMutation,
} = DepositApi;
