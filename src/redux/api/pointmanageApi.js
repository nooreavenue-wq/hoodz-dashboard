import { baseApi } from "./baseApi";

const PointManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPointManagement: builder.query({
      query: ({ id }) => ({
        url: `/points-logs/user/${id}`,
        method: "GET",
      }),
      providesTags: ["PointManagement"],
    }),
    updatePointManagement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}/points-adjustment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PointManagement"],
    }),
  }),
});

export const { useGetPointManagementQuery, useUpdatePointManagementMutation } =
  PointManagementApi;
