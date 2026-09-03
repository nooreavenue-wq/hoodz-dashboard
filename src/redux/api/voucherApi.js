import { baseApi } from "./baseApi";

const VoucherAPi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addVoucher: build.mutation({
      query: (payload) => ({
        url: "/voucher",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Vouchers"],
    }),
    getVoucher: build.query({
      query: ({ page = 1, limit = 10, searchText = "", id }) => ({
        url: `/voucher/shopwise/${id}?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Vouchers"],
    }),
    getSingleVoucher: build.query({
      query: (id) => `/voucher/${id}`,
      providesTags: ["Vouchers"],
    }),
    updateVoucher: build.mutation({
      query: ({ id, payload }) => ({
        url: `/voucher/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Vouchers"],
    }),
    deleteVoucher: build.mutation({
      query: (id) => ({
        url: `/voucher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vouchers"],
    }),
    changeVoucherStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/voucher/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Vouchers"],
    }),

    // Global boucher api

    getGlobalVoucher: build.query({
      query: ({ page = 1, limit = 10, searchText = "" }) => ({
        url: `/voucher/global?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Vouchers"],
    }),
  }),
});

export const {
  useAddVoucherMutation,
  useGetVoucherQuery,
  useGetSingleVoucherQuery,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
  useChangeVoucherStatusMutation,
  useGetGlobalVoucherQuery,
} = VoucherAPi;
