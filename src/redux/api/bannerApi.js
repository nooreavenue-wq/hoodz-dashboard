import { baseApi } from "./baseApi";

const BannerAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: ({ page = 1, limit = 12, searchText = "" } = {}) => ({
        url: `/banner?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation({
      query: (payload) => ({
        url: "/banner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Banners"],
    }),
    banerStatusToggle: builder.mutation({
      query: (id) => ({
        url: `/banner/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),

    // create campain

    createCampain: builder.mutation({
      query: (payload) => ({
        url: "/campain",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateCampain: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/campain/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteCampain: builder.mutation({
      query: (id) => ({
        url: `/campain/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
    getCampains: builder.query({
      query: ({ page = 1, limit = 12, searchText = "" } = {}) => ({
        url: `/campain?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useBanerStatusToggleMutation,
  useCreateCampainMutation,
  useUpdateCampainMutation,
  useDeleteCampainMutation,
  useGetCampainsQuery,
} = BannerAPi;
