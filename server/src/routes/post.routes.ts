import express from "express";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
  // uploadImagesHandler,
} from "../controllers/post.controller";
import { uploadImagesMiddleWare } from "../middleware/fileUpload";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  updatePostSchema,
} from "../schemas/post.schema";

const postRoutes = express.Router();

postRoutes.post(
  "/",
  requireUser,
  // validateResource(createPostSchema),
  uploadImagesMiddleWare,
  createPostHandler
);

// postRoutes.post(
//   "/upload-multiple-images",
//   requireUser,
//   uploadImagesMiddleWare,
//   uploadImagesHandler
// );

postRoutes.get("/:id", validateResource(getPostSchema), getPostHandler);

postRoutes.patch(
  "/:id",
  requireUser,
  validateResource(updatePostSchema),
  updatePostHandler
);

postRoutes.delete(
  "/:id/delete",
  requireUser,
  validateResource(deletePostSchema),
  deletePostHandler
);

export default postRoutes;
