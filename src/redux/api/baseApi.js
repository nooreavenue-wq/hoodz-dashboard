import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("Authorization", token);
    }
    const signUpToken = localStorage.getItem("signupToken");
    if (signUpToken) {
      headers.set("token", signUpToken);
    }
    const guestToken = sessionStorage.getItem("guestToken");
    if (guestToken) {
      headers.set("token", guestToken);
    }
    const forgetPasswordToken = localStorage.getItem("forgetPasswordToken");
    if (forgetPasswordToken) {
      headers.set("Authorization", forgetPasswordToken);
    }

    return headers;
  },
});
const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args?.url || "";

  const publicEndpoints = [
    "/auth/login",
    "/otp/verify-otp",
    "/otp/resend-otp",
    "/auth/forgot-password",
    "/auth/change-password",
    "/otp/verify?type=signup",
    "/auth/change-password",
  ];

  const isPublic = publicEndpoints.some((endpoint) => url.includes(endpoint));

  const { user, token } = api.getState().auth || {};
  if (!isPublic && (!token || !user)) {
    api.dispatch(logout());
    return {
      error: {
        status: 401,
        data: { message: "Unauthorized - Please login again" },
      },
    };
  }
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const token = api.getState().auth.token;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        // credentials: 'include',
      },
    );

    const data = await res.json();
    if (data?.data?.accessToken) {
      const user = api.getState().auth.user;

      api.dispatch(setUser({ user, token: data.data.accessToken }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "transactions",
    "content",
    "user",
    "auth",
    "notification",
    "categories",
    "banner",
    "delivery-charge",
    "refundRequests",
    "withdrawalRequests",
    "faq",
    "contentModeration",
    "categories",
    "complain",
    "withdrawals",
    "PointManagement",
    "ReportedContent",
    "Orders",
    "kyc",
    "Banners",
    "settings",
    "Products",
    "Vouchers",
    "Deposits",
    "profile",
    "Grievance",
  ],
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});
