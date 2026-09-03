import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: "/auth/login-with-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profile", "notification"],
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: `/otp/verify?type=signup`,
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/otp/resend-otp",
        method: "POST",
        body: { email: data },
      }),
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changepassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // get my profile ---------------

    getMyProfile: builder.query({
      query: (data) => ({
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),

    // update profile api endpoint
    updateProfileinfo: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useSignInMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useChangepasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileinfoMutation,
} = authApi;
