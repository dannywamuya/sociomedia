import express from "express";
import { creatUserHandler } from "../controllers/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schemas/user.schema";

const userRoutes = express.Router();

userRoutes.post(
  "/api/users",
  validateResource(createUserSchema),
  creatUserHandler
);

export default userRoutes;
