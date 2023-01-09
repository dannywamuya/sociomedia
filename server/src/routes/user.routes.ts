import express from "express";
import {
  creatUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import requireUser from "../middleware/requireUser";
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

// Get current user
userRoutes.get("/api/users/me", requireUser, getCurrentUserHandler);

export default userRoutes;
