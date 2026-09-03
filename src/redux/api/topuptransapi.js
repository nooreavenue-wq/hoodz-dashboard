import { baseApi } from "./baseApi";

const TopUpTrans = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopUpTrans: builder.query({
      query: (id) => ({
        url: `/top-up/transactions/${id}`,
        method: "GET",
      }),
    }),
    getTopUpTransList: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/top-up/summary?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTopUpTransQuery, useGetTopUpTransListQuery } = TopUpTrans;
