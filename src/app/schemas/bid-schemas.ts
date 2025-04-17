import { z } from "zod";

export const bidSchema = z.object({
  id: z.string().optional(), // Optional for new bids
  value: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number().min(0, "Bid value must be positive"), // Ensure bid value is positive
  ),
  amount: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    z.number().min(1, "Amount must be at least 1"), // Ensure amount is at least 1
  ),
  createdAt: z.date().optional(), // Optional for new bids
  userId: z.string(), // Required user ID
  productId: z.string(), // Required product ID
  metric: z.enum(["KG", "MT"], { required_error: "Metric is required" }),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(), // Optional with default "PENDING"
  createdBy: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(), // Optional nested user object
  product: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(), // Optional nested product object
});

export type BidType = z.infer<typeof bidSchema>;
