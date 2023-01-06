import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First Name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short! It should be a minimum of 6 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string({
      required_error: "ID is required",
    }),
    verificationCode: string({
      required_error: "Verification Code is required",
    }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>;
