import express from "express";
import {
  creatUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schemas/user.schema";

const userRoutes = express.Router();

// Create User
userRoutes.post(
  "/api/users",
  validateResource(createUserSchema),
  creatUserHandler
);

// Verify User
userRoutes.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

// Request Password Reset Code
userRoutes.post(
  "/api/users/forgotPassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

// Reset Password
userRoutes.post(
  "/api/users/resetPassword/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

export default userRoutes;
