import express from "express";
import { createSessionHandler } from "../controllers/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schemas/auth.schema";

const authRoutes = express.Router();

authRoutes.post(
  "/login",
  validateResource(createSessionSchema),
  createSessionHandler
);

export default authRoutes;
