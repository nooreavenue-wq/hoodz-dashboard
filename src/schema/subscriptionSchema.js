"use client";

import * as z from "zod";

export const createSubscriptionSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  duration: z
    .string({ required_error: "Duration is required" })
    .min(1, { message: "Duration is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(50, { message: "Description is required" }),
  price: z.coerce
    .number({ required_error: "Price is required" })
    .min(1, { message: "Price is required" }),
});
