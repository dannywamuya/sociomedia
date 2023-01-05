import express from "express";

const router = express.Router();

router.get("/api/health", (_, res) => {
  return res.sendStatus(200);
});

export default router;
