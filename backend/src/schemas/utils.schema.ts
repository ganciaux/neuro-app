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

export function createPaginatedSchema<T extends z.ZodRawShape>(fields: T) {
  return PaginationSchema.extend(fields).transform((data): {
    paginationOptions: { page: number; pageSize: number };
    filters: z.infer<z.ZodObject<T>>;
  } => {
    const { page, pageSize, ...filters } = data;
    return {
      paginationOptions: { page, pageSize },
      filters: filters as z.infer<z.ZodObject<T>>
    };
  });
}