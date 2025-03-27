import { z } from "zod";

export const PaginationSchema = z.object({
  /** Page number. */
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number.")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page must be greater than 0.")
    .default("1"),
  /** Page size. */
  pageSize: z
    .string()
    .regex(/^\d+$/, "Page size must be a number.")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page size must be greater than 0.")
    .default("10"),
});

export function createSearchSchema<T extends z.ZodRawShape>(additionalFields: T) {
  return PaginationSchema.extend(additionalFields);
}