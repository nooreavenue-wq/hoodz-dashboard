import { baseApi } from "./baseApi";

const dashBoardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({ year }) => ({
        url: `/meta/admin?year=${year}`,
        method: "GET",
      }),
    }),

    // get analytics data

    getanalytics: builder.query({
      query: ({
        revenueFilter,
        orderFilter,
        categoryFilter,
        performenceFilter,
      }) => ({
        url: `/analysis?revenueFilter=${revenueFilter}&orderFilter=${orderFilter}&categoryFilter=${categoryFilter}&performenceFilter=${performenceFilter}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery, useGetanalyticsQuery } = dashBoardApi;
