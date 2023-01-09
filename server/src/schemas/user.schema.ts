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

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email."),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string({
      required_error: "ID is required",
    }),
    passwordResetCode: string({
      required_error: "Password reset code is required",
    }),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short! It should be a minimum of 6 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const getUserSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>;

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export type GetUserInput = TypeOf<typeof getUserSchema>;