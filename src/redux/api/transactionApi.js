const { baseApi } = require("./baseApi");

const TransactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/payments?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
        params: { page, limit, searchTerm: searchText },
      }),
      providesTags: ["transactions"],
    }),

    getSingleTrans: build.query({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),

    Vendortransction: build.query({
      query: ({ id }) => ({
        url: `/vendor-transactions?vendorId=${id}`,
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),

    submitVendorPayment: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/vendors/${id}/pay`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["transactions"],
    }),

    getVendorOwntransction: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/vendor-transactions/my-payment-transction?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetSingleTransQuery,
  useVendortransctionQuery,
  useSubmitVendorPaymentMutation,
  useGetVendorOwntransctionQuery,
} = TransactionApi;
