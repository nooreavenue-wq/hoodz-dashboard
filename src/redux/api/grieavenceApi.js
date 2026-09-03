import { baseApi } from "./baseApi";

const GriavanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGriavance: builder.query({
      query: ({ page = 1, limit = 10, searchText = "" } = {}) => ({
        url: `/grievance?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Grievance"],
    }),
    getSingleGriavance: builder.query({
      query: (id) => ({
        url: `/grievance/${id}`,
        method: "GET",
      }),
      providesTags: ["Grievance"],
    }),
    updateGriavance: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/grievance/status/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Grievance"],
    }),
  }),
});

export const {
  useGetGriavanceQuery,
  useGetSingleGriavanceQuery,
  useUpdateGriavanceMutation,
} = GriavanceApi;
