import { bucket } from "../utils/cloudStorage";
import { updateProfilePicture } from "./user.service";
import { imageMimeTypeToFileExtension } from "../utils/upload";
import { IPostImages, IUploadResult } from "../models/global.types";
import { savePostImagesSvc } from "./post.service";

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
    const folderName = `profile-pictures/${userId}/`;
    const fileName = `${folderName}${new Date().getTime()}${imageMimeTypeToFileExtension(
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

        const msg = "Uploaded profile picture successfully";

        try {
          // Make the file public
          await bucket.file(fileName).makePublic();
          result.status = 200;
          result.message = `${msg}: ${file.originalname}`;
          resolve(result);
        } catch (e) {
          result.status = 500;
          result.message = `${msg}: ${file.originalname}, but public access is denied!`;
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
    result.message = `Could not upload profile picture: ${file.originalname}. ${err}`;
    return Promise.reject(result);
  }
};

export const uploadMultipleImagesSvc = async (
  files: Express.Multer.File[],
  postId: string,
  userId: string
): Promise<IPostImages> => {
  const failedUploads: IUploadResult[] = [];
  const successfulUploads: IUploadResult[] = [];

  try {
    const folderName = `post-images/${postId}/`;

    await Promise.all(
      files.map(async (file, idx) => {
        const fileName = `${folderName}${new Date().getTime()}_${idx}${imageMimeTypeToFileExtension(
          file.mimetype
        )}`;

        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
          resumable: false,
        });

        let result: IUploadResult = {
          status: 500,
          message: "",
          url: undefined,
        };

        return new Promise((resolve, reject) => {
          blobStream.on("finish", async () => {
            // Create a URL for direct file access via HTTP.
            result.url = new URL(
              `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            ).toString();

            const msg = "Uploaded profile picture successfully";

            try {
              // Make the file public
              await bucket.file(fileName).makePublic();
              result.status = 200;
              result.message = `${msg}: ${file.originalname}`;
              successfulUploads.push(result);
              resolve(result);
            } catch (e) {
              result.status = 500;
              result.message = `${msg}: ${file.originalname}, but public access is denied!`;
              failedUploads.push(result);
              reject(result);
            }

            await savePostImagesSvc(userId, postId, result.url);
          });

          blobStream.on("error", (err) => {
            result.status = 500;
            result.message = err.message;
            reject(result);
          });

          blobStream.end(file.buffer);
        });
      })
    );
  } catch (err) {
    files.forEach((file) => {
      failedUploads.push({
        status: 500,
        message: `Could not upload profile picture: ${file.originalname}. ${err}`,
        url: "",
      });
    });
  }

  return { successfulUploads, failedUploads };
};
