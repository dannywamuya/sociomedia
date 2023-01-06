import express from "express";
import {
  creatUserHandler,
  verifyUserHandler,
} from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema, verifyUserSchema } from "../schemas/user.schema";

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

export default userRoutes;
