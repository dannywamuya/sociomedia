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
userRoutes.post("/", validateResource(createUserSchema), creatUserHandler);

// Verify User
userRoutes.post(
  "/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

// Request Password Reset Code
userRoutes.post(
  "/forgotPassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

// Reset Password
userRoutes.post(
  "/resetPassword/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);

// Get current user
userRoutes.get("/me", requireUser, getCurrentUserHandler);

export default userRoutes;
