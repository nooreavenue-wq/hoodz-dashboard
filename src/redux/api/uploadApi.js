import { baseApi } from "./baseApi";

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation({
      query: (formData) => ({
        url: "/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadFilesMutation } = uploadApi;
