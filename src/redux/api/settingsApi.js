import { baseApi } from "./baseApi";

const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTerms: build.query({
      query: ({ key }) => ({ url: `/settings?key=${key}`, method: "GET" }),
      providesTags: ["settings"],
    }),
    updateUserTerms: build.mutation({
      query: (values) => ({
        url: "/settings/userTermsAndConditions",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["settings"],
    }),
    updateRiderTerms: build.mutation({
      query: (data) => ({
        url: "/settings/riderTermsAndConditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateVendorTerms: build.mutation({
      query: (data) => ({
        url: "/settings/vendorTermsAndConditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateAgentTerms: build.mutation({
      query: (data) => ({
        url: "/settings/agentTermsAndConditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    getPrivecy: build.query({
      query: ({ key }) => ({ url: `/settings?key=${key}`, method: "GET" }),
      providesTags: ["settings"],
    }),
    updateUserPrivecy: build.mutation({
      query: (data) => ({
        url: "/settings/userPrivacyAndPolicy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateRiderPrivecy: build.mutation({
      query: (data) => ({
        url: "/settings/riderPrivacyAndPolicy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateVendorPrivecy: build.mutation({
      query: (data) => ({
        url: "/settings/vendorPrivacyAndPolicy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    updateAgentPrivecy: build.mutation({
      query: (data) => ({
        url: "/settings/agentPrivacyAndPolicy",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),

    // general settings api

    updateGeneralSettings: build.mutation({
      query: (data) => ({
        url: "/settings/generals",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
    setDeliveryFee: build.mutation({
      query: (data) => ({
        url: "/settings/deliveryCharge",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),

    setFawryAccount: build.mutation({
      query: (data) => ({
        url: "/settings/fawryAccount",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useGetTermsQuery,
  useUpdateUserTermsMutation,
  useUpdateRiderTermsMutation,
  useUpdateVendorTermsMutation,
  useUpdateAgentTermsMutation,
  useGetPrivecyQuery,
  useUpdateUserPrivecyMutation,
  useUpdateRiderPrivecyMutation,
  useUpdateVendorPrivecyMutation,
  useUpdateAgentPrivecyMutation,

  useUpdateGeneralSettingsMutation,
  useSetDeliveryFeeMutation,
  useSetFawryAccountMutation,
} = settingsApi;
