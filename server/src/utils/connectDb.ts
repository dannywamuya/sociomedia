import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

const dbUri = config.get<string>("dbUri");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, { autoIndex: false });
    logger.info("Connected to DB");
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

export default connectDB;
