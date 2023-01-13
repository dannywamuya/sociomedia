import util from "util";
import Multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";
import { filterMimeTypes } from "../utils/upload";

const SINGLE_FILE_LIMIT = 2 * 1024 * 1024;
const ALLOWED_MIMETYPES = ["image/jpeg", "image/png"];

export const uploadProfilePictureMiddleWare = [
  util.promisify(
    Multer({
      storage: Multer.memoryStorage(),
      limits: { fileSize: SINGLE_FILE_LIMIT },
      fileFilter(req, file, cb) {
        if (!filterMimeTypes(ALLOWED_MIMETYPES, file)) {
          const err = new Error(
            "Invalid file type. Only jpeg and png images are allowed."
          );
          err.name = "INVALID_FILE_TYPE";
          cb(err);
        }
        cb(null, true);
      },
    }).single("profilePicture")
  ),
  (err: MulterError, req: Request, res: Response, next: NextFunction) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        message: `Error: ${err.message} The file should be less than 2MB.`,
      });
    } else if (err.name === "INVALID_FILE_TYPE") {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    } else {
      return next(err);
    }
  },
];

export const uploadImagesMiddleWare = [
  util.promisify(
    Multer({
      storage: Multer.memoryStorage(),
      limits: { fileSize: SINGLE_FILE_LIMIT, files: 4 },
      fileFilter(req, file, cb) {
        if (!filterMimeTypes(ALLOWED_MIMETYPES, file)) {
          const err = new Error(
            "Invalid file type. Only jpeg and png images are allowed."
          );
          err.name = "INVALID_FILE_TYPE";
          cb(err);
        }
        cb(null, true);
      },
    }).array("images")
  ),
  (err: MulterError, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      return res.status(400).send({
        message: `Error: ${err.message}`,
      });
    }
    return next(err);
  },
];
