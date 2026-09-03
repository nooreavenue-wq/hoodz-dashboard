import { baseApi } from "./baseApi";

const ContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContentsTermsandConditions: builder.query({
      query: () => ({ url: `/contents?key=tramsAndCondition`, method: "GET" }),
      providesTags: ["content"],
    }),
    updateContentTermsandConditions: builder.mutation({
      query: (data) => ({
        url: `/contents/tramsAndCondition`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),
    getContentsPrivacyPolicy: builder.query({
      query: () => ({ url: `/contents?key=privacyAndPolicy`, method: "GET" }),
      providesTags: ["content"],
    }),
    updateContentPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/contents/privacyAndPolicy`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["content"],
    }),

    getGeneralSettings: builder.query({
      query: () => ({ url: `/contents/general`, method: "GET" }),
      providesTags: ["content"],
    }),
    updateGeneralSettings: builder.mutation({
      query: ({ payload }) => ({
        url: `/contents/generals`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["content"],
    }),
  }),
});

export const {
  useGetContentsTermsandConditionsQuery,
  useUpdateContentTermsandConditionsMutation,
  useGetContentsPrivacyPolicyQuery,
  useUpdateContentPrivacyPolicyMutation,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
} = ContentApi;
