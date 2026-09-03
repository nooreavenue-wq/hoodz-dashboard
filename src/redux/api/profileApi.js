import { baseApi } from "./baseApi";

const ProfileAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/users/me`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/users/me`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = ProfileAPi;
