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

export const filterMimeTypes = (
  allowedMimeTypes: string[],
  file: Express.Multer.File
): boolean => allowedMimeTypes.includes(file.mimetype);
