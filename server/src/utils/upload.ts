import util from "util";
import Multer from "multer";

const SINGLE_FILE_LIMIT = 2 * 1024 * 1024;

export const uploadSingleFileMiddleWare = util.promisify(
  Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: SINGLE_FILE_LIMIT },
  }).single("file")
);
