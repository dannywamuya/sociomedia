import util from "util";
import Multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";

const SINGLE_FILE_LIMIT = 2 * 1024 * 1024;
const ALLOWED_MIMETYPES = ["image/jpeg", "image/png"];

export const uploadSingleFileMiddleWare = [
  util.promisify(
    Multer({
      storage: Multer.memoryStorage(),
      limits: { fileSize: SINGLE_FILE_LIMIT },
    }).single("file")
  ),
  (req: Request, res: Response, next: NextFunction) => {
    if (!filterMimeTypes(ALLOWED_MIMETYPES, req)) {
      return res.status(400).send({
        message: "Invalid file type. Only jpeg and png images are allowed",
      });
    }
    return next();
  },
  (err: MulterError, req: Request, res: Response, next: NextFunction) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        message: `Error: ${err.message} The file should be less than 2MB.`,
      });
    } else {
      return next(err);
    }
  },
];

export const imageMimeTypeToFileExtension = (
  mimeType: string
): string | undefined => {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/bmp":
      return ".bmp";
    case "image/svg+xml":
      return ".svg";
    default:
      return undefined;
  }
};

function filterMimeTypes(allowedMimeTypes: string[], req: Request): boolean {
  if (!req.file) return false;

  const fileMimeType = req.file.mimetype;
  return allowedMimeTypes.includes(fileMimeType);
}
