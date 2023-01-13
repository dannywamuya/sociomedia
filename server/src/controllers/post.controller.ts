import { Request, Response } from "express";
import { IPostImages, MyLocals } from "../models/global.types";
import {
  CreatePostInput,
  GetPostInput,
  UpdatePostInput,
} from "../schemas/post.schema";
import {
  createPostSvc,
  getSinglePostSvc,
  updatePostImages,
  updatePostSvc,
} from "../services/post.service";
import { uploadMultipleImagesSvc } from "../services/upload.service";

/* Upload a post and image/images. 
  Saves the post and images to DB after uploading any 
  images to cloud storage
*/
export const createPostHandler = async (
  req: Request<{}, {}, CreatePostInput["body"]>,
  res: Response<any, MyLocals>
) => {
  const user = res.locals.user;

  if (!req.body.description) {
    return res
      .status(400)
      .send({ status: 400, message: "Could not upload post." });
  }

  let response: { post: any; files: IPostImages | undefined } = {
    post: undefined,
    files: undefined,
  };

  const files: any = req?.files;

  if (files) {
    const createdPost = await createPostSvc(req.body, user);

    response.files = await uploadMultipleImagesSvc(
      files,
      createdPost._id,
      user._id
    );

    const picturePaths: any[] = response.files.successfulUploads.map(
      (file) => file.url
    );

    response.post = await updatePostImages(
      createdPost._id,
      picturePaths,
      user._id
    );

    return res.send(response);
  }

  response.post = await createPostSvc(req.body, user);

  return res.send(response);
};

/* Get a single post */
export const getPostHandler = async (
  req: Request<GetPostInput["params"]>,
  res: Response<any, MyLocals>
) => {
  const { id } = req.params;
  const result = await getSinglePostSvc(id);

  if (result.status !== 200) return res.status(result.status).send(result);

  return res.send(result.post);
};

/* Update the post description */
export const updatePostHandler = async (
  req: Request<UpdatePostInput["params"], {}, UpdatePostInput["body"]>,
  res: Response
) => {
  const user = res.locals.user;
  const post = await updatePostSvc(req.body, req.params, user);

  return res.send(post);
};

/* Delete post and/or images from a post, image model, cloud storage*/
export const deletePostHandler = (req: Request, res: Response) => {};

/* Delete images from a post, image model, cloud storage*/
export const deletePostImageHandler = (req: Request, res: Response) => {};

// export const uploadImagesHandler = async (req: Request, res: Response) => {
//   const files: any = req?.files;

//   if (!files) return res.status(400).send("Please upload at least 1 image.");

//   return res.send(await uploadMultipleImagesSvc(files, "test-post-id"));
// };
