import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email format"),
  dni: z.string().length(8, "DNI must be 8 digits long"),
});
