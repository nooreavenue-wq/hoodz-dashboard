const PromotionalNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPromotionalNotification: builder.query({
      query: ({ limit, page, searchText }) => ({
        url: `/notification/promotional?limit=${limit}&page=${page}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["promotionalNotification"],
    }),
    createPromotionalNotification: builder.mutation({
      query: (data) => ({
        url: "/notification/promotional",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["promotionalNotification"],
    }),
    updatePromotionalNotification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/promotional-notification/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["promotionalNotification"],
    }),
    deletePromotionalNotification: builder.mutation({
      query: (id) => ({
        url: `/promotional-notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["promotionalNotification"],
    }),
  }),
});

export const {
  useGetAllPromotionalNotificationQuery,
  useCreatePromotionalNotificationMutation,
  useUpdatePromotionalNotificationMutation,
  useDeletePromotionalNotificationMutation,
} = PromotionalNotificationApi;

export default PromotionalNotificationApi;
