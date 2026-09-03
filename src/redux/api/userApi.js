import { baseApi } from "./baseApi";

const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["user,notification"],
    }),
    getAllVendors: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/users?limit=${limit}&page=${page}&searchTerm=${searchText}&role=vendor`,
        method: "GET",
      }),
      providesTags: ["user,transactions"],
    }),
    // get single user
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["user,notification"],
    }),
    changeUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      invalidatesTags: ["user,notification"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["user"],
    }),

    // add vendor add agent api

    addVendor: builder.mutation({
      query: (data) => ({
        url: `/users/vendors/invite`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    addAgent: builder.mutation({
      query: (data) => ({
        url: `/users/agents/invite`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    // change agent agentSchedule
    changeagentSchedule: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/agents/${id}/schedule`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllusersQuery,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useAddVendorMutation,
  useAddAgentMutation,
  useGetAllVendorsQuery,
  useChangeagentScheduleMutation,
} = UserApi;
