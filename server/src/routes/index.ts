import express from "express";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.get("/api/health", (_, res) => {
  return res.sendStatus(200);
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
