import {z} from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const RegisterSchema = z.object({
    firstName: z.string(),
    lastName : z.string(),
    email: z.string().email(),
    password: z.string()
                // .min(6, "Password must be at least 6 characters long")
                // .max(14, "Password cannot exceed 14 characters")
                // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                // .regex(/[0-9]/, "Password must contain at least one number")
                // .regex(/[\W_]/, "Password must contain at least one special character")
})