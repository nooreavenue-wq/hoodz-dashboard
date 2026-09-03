import { baseApi } from "./baseApi";

const SubCriptionAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCription: builder.query({
      query: () => ({ url: `/packages`, method: "GET" }),
      providesTags: ["subCription"],
    }),
    CreateSubCription: builder.mutation({
      query: (data) => ({ url: "/packages", method: "POST", body: data }),
      invalidatesTags: ["subCription"],
    }),
    deleteSubCription: builder.mutation({
      query: (id) => ({ url: `/packages/${id}`, method: "DELETE" }),
      invalidatesTags: ["subCription"],
    }),
    updateSubCription: builder.mutation({
      query: ({ id, value }) => ({
        url: `/packages/${id}`,
        method: "PUT",
        body: value,
      }),
      invalidatesTags: ["subCription"],
    }),

    // subscription history api
    getAllSubscriptionHistory: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/subscriptions`,
        method: "GET",
        params: { page, limit, searchTerm: searchText },
      }),
      providesTags: ["subscriptionHistory"],
    }),

    pasueSubscription: builder.mutation({
      query: ({ id, status }) => ({
        url: `/subscriptions/status/${id}`,
        method: "PATCH",
        body: { status: status },
      }),
      invalidatesTags: ["subscriptionHistory"],
    }),
  }),
});

export const {
  useGetAllSubCriptionQuery,
  useCreateSubCriptionMutation,
  useDeleteSubCriptionMutation,
  useUpdateSubCriptionMutation,
  useGetAllSubscriptionHistoryQuery,
  usePasueSubscriptionMutation,
} = SubCriptionAPi;
