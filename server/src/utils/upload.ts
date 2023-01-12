import util from "util";
import Multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";

const SINGLE_FILE_LIMIT = 2 * 1024 * 1024;

export const uploadSingleFileMiddleWare = [
  util.promisify(
    Multer({
      storage: Multer.memoryStorage(),
      limits: { fileSize: SINGLE_FILE_LIMIT },
    }).single("file")
  ),
  (err: MulterError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message, "err");
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        message: `Error: ${err.message} The file should be less than 2MB.`,
      });
    } else {
      return next(err);
    }
  },
];
