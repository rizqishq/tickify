import { z } from "zod";

export const registerSchema = z.object({
    full_name: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    phone_number: z.string().min(8, "Phone number too short").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const loginSchema = z.object({
    email: z.string().email().optional(),
    phone_number: z.string().optional(),
    password: z.string().min(1, "Password is required"),
}).refine((data) => data.email || data.phone_number, {
    message: "Email or Phone number is required",
    path: ["email"],
});
