import { bucket } from "../utils/cloudStorage";
import { format } from "util";

interface IUploadResult {
  status: number;
  message: string;
  url: string | undefined;
}

export const uploadProfilePictureSVC = async (
  file: Express.Multer.File
): Promise<IUploadResult> => {
  let result: IUploadResult = {
    status: 500,
    message: "",
    url: undefined,
  };
  try {
    // Create a new blob in the bucket and upload the file data to cloud storage.
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on("finish", async () => {
        // Create a URL for direct file access via HTTP.
        result.url = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );

        try {
          // Make the file public
          await bucket.file(file.originalname).makePublic();
          result.status = 200;
          result.message = `Uploaded the file successfully: ${file.originalname}`;
          resolve(result);
        } catch (e) {
          result.status = 500;
          result.message = `Uploaded the file successfully: ${file.originalname}, but public access is denied!`;
          reject(result);
        }
      });

      blobStream.on("error", (err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });

      blobStream.end(file.buffer);
    });
  } catch (err) {
    result.status = 500;
    result.message = `Could not upload the file: ${file.originalname}. ${err}`;
    return Promise.reject(result);
  }
};
