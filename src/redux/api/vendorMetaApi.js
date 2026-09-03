import { baseApi } from "./baseApi";

const VendorMetaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVendorMeta: build.query({
      query: ({ ordersEarninigFilter, ordersCountFilter }) => ({
        url: `/meta/vendor?ordersEarninigFilter=${ordersEarninigFilter}&ordersCountFilter=${ordersCountFilter}`,
        method: "GET",
      }),
    }),

    // vendor shop api

    getVendorgeneral: build.query({
      query: ({ id }) => ({
        url: `/settings/generals?vendorId=${id}`,
        method: "GET",
      }),
    }),

    updateVendorGeneral: build.mutation({
      query: (data) => ({
        url: `/settings/generals`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetVendorMetaQuery,
  useGetVendorgeneralQuery,
  useUpdateVendorGeneralMutation,
} = VendorMetaApi;
