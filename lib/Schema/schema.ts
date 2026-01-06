import * as zod from 'zod';



export const registerSchema = zod.object({
    name: zod.string()
        .nonempty("Name is required")
        .min(3, "Name must be at least 3 characters long"),
    email: zod.string()
        .nonempty("Email is required")
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
    password: zod.string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Invalid password format"),
    rePassword: zod.string()
        .nonempty("Please re-enter your password"),
    phoneNumber: zod.string()
        .nonempty("Please enter your phone number")
        .min(10, "Phone number must be at least 10 digits")
        .max(11, "Phone number must be at most 11 digits"),
    dateOfBirth: zod.coerce.date()
        .refine((data) => {
            const birthYear = data.getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            return age >= 13;
        }),
    gender: zod.string()
        .nonempty("Gender must be selected")
        .regex(/^(male|female)$/),
}).refine((data) => data.password === data.rePassword, {message: "Passwords don't match", path: ['rePassword']});