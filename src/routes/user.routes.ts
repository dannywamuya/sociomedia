import express from "express";
import {
  creatUserHandler,
  forgotPasswordHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  verifyUserSchema,
} from "../schemas/user.schema";

const userRoutes = express.Router();

userRoutes.post(
  "/api/users",
  validateResource(createUserSchema),
  creatUserHandler
);

userRoutes.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
);

userRoutes.post(
  "/api/users/forgotPassword",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

export default userRoutes;
