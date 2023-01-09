import express from "express";
import {
  addRemoveFriend,
  creatUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  getUser,
  getUserFriendsHandler,
  resetPasswordHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  getUserSchema,
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

// Get User
userRoutes.get("/:id", validateResource(getUserSchema), requireUser, getUser);

// Add or Remove Friend
userRoutes.patch("/:id/addRemoveFriend", requireUser, addRemoveFriend);

userRoutes.get("/:id/followers", requireUser, getUserFriendsHandler);

export default userRoutes;
