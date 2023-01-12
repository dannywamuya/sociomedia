import { bucket } from "../utils/cloudStorage";
import { updateProfilePicture } from "./user.service";
import { imageMimeTypeToFileExtension } from "../utils/upload";

interface IUploadResult {
  status: number;
  message: string;
  url: string | undefined;
}

export const uploadProfilePictureSVC = async (
  file: Express.Multer.File,
  userId: string
): Promise<IUploadResult> => {
  let result: IUploadResult = {
    status: 500,
    message: "",
    url: undefined,
  };
  try {
    // Create a new blob in the bucket and upload the file data to cloud storage.
    const folderName = "profile-pictures/";
    const fileName = `${folderName}${new Date().getTime()}_${userId}${imageMimeTypeToFileExtension(
      file.mimetype
    )}`;

    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on("finish", async () => {
        // Create a URL for direct file access via HTTP.
        result.url = new URL(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        ).toString();

        try {
          // Make the file public
          await bucket.file(fileName).makePublic();
          result.status = 200;
          result.message = `Uploaded the file successfully: ${file.originalname}`;
          resolve(result);
        } catch (e) {
          result.status = 500;
          result.message = `Uploaded the file successfully: ${file.originalname}, but public access is denied!`;
          reject(result);
        }

        await updateProfilePicture(userId, result.url);
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
