import { baseApi } from "./baseApi";

const MessageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChatList: build.query({
      query: ({ page, limit, searchText }) => ({
        url: `/chat?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),
    getMessageByChatId: build.query({
      query: (id) => ({
        url: `/messages/chat/${id}`,
        method: "GET",
      }),
      providesTags: ["message"],
    }),
  }),
});

export const { useGetChatListQuery, useGetMessageByChatIdQuery } = MessageApi;
