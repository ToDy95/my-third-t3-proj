import { z } from "zod";
export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z.number().min(0, "Price must be positive"),
  ),
  stock: z.preprocess(
    (value) => (typeof value === "string" ? parseInt(value, 10) : value),
    z.number().min(100, "Quantity must be at least 100"),
  ),
  image: z.string().url().nullable(),
  category: z.enum(["CEREALS", "VEGETABLES", "SEEDS", "FRUITS"]),
  createdAt: z.date().optional(), // Make createdAt optional
  updatedAt: z.date().optional(), // Make updatedAt optional
  createdById: z.string().optional(),
  createdBy: z
    .object({
      name: z.string(),
    })
    .optional(),
});

export type ProductType = z.infer<typeof productSchema>;
