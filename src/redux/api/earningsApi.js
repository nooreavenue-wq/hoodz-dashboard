import { baseApi } from "./baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEarnings: builder.query({
      query: ({ currentPage }) => ({
        url: `/payments/dashboard-data?page=${currentPage}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllEarningsQuery } = earningsApi;
