import { z } from "zod";
export const createUserDTO = z.object({
  dni: z.string().min(8, "DNI es requerido"),
  full_name: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Email no es válido"),
});

export const updateUserDTO = z.object({
  dni: z.string().min(8, "DNI es requerido"),
  full_name: z.string().min(5, "El nombre completo es requerido"),
  email: z.string().email("Email no es válido"),
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
  role: z.string().min(1, "El rol es requerido"),
  enabled: z.boolean(),
});
