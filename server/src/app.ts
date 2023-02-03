require("dotenv").config();
import express from "express";
import config from "config";
import connectDB from "./utils/connectDb";
import logger from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.development
      ? "http://localhost:5173"
      : process.env.ORIGIN_URL,
  })
);
app.use(express.json());
app.use(deserializeUser);
app.use("/api", router);

const port = config.get<number>("port");

app.listen(port, async () => {
  logger.info(`App is listening...`);
  await connectDB();
});
