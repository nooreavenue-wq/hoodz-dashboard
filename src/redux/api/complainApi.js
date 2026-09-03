const { baseApi } = require("./baseApi");

const ComplainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplains: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: "/supports",
        method: "GET",
        params: { page, limit, searchTerm: searchText },
      }),
      providesTags: ["complain"],
    }),
    deleteComplain: builder.mutation({
      query: (id) => ({
        url: `/supports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["complain"],
    }),
    getSingleComplain: builder.query({
      query: (id) => ({
        url: `/complains/${id}`,
        method: "GET",
      }),
      providesTags: ["complain"],
    }),
    sendReply: builder.mutation({
      query: (arg) => ({
        url: `/supports/sent-message/${arg.id}`,
        method: "POST",
        body: arg.payload,
      }),
      invalidatesTags: ["complain"],
    }),
  }),
});

export const {
  useGetComplainsQuery,
  useDeleteComplainMutation,
  useGetSingleComplainQuery,
  useSendReplyMutation,
} = ComplainApi;
