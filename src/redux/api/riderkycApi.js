import { baseApi } from "./baseApi";

const RiderKyc = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRiderKyc: builder.query({
      query: (id) => ({
        url: `/kyc/${id}`,
        method: "GET",
      }),
      providesTags: ["kyc"],
    }),
    updateRiderKyc: builder.mutation({
      query: ({ id, data }) => ({
        url: `/kyc/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["kyc"],
    }),
    getRiderKycList: builder.query({
      query: ({ page, limit, searchText }) => ({
        url: `/kyc?page=${page}&limit=${limit}&searchTerm=${searchText}`,
        method: "GET",
      }),
      providesTags: ["kyc"],
    }),
  }),
});

export const {
  useGetRiderKycQuery,
  useUpdateRiderKycMutation,
  useGetRiderKycListQuery,
} = RiderKyc;
