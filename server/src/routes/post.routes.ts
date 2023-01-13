import express from "express";
import {
  archivePostHandler,
  createPostHandler,
  deletePostHandler,
  getPostFeedHandler,
  getPostHandler,
  getUserPostsHandler,
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
  getUserPostsSchema,
  updatePostSchema,
} from "../schemas/post.schema";

const postRoutes = express.Router();

// Create post and upload images
postRoutes.post(
  "/",
  requireUser,
  // validateResource(createPostSchema),
  uploadImagesMiddleWare,
  createPostHandler
);

// Upload multiple images
// postRoutes.post(
//   "/upload-multiple-images",
//   requireUser,
//   uploadImagesMiddleWare,
//   uploadImagesHandler
// );

// Get one post
postRoutes.get("/:id", validateResource(getPostSchema), getPostHandler);

// Update a post
postRoutes.patch(
  "/:id",
  requireUser,
  validateResource(updatePostSchema),
  updatePostHandler
);

// Delete a post
postRoutes.delete(
  "/:id",
  validateResource(deletePostSchema),
  requireUser,
  deletePostHandler
);

// Archive a post
postRoutes.patch("/:id/archive", requireUser, archivePostHandler);

// Get Post Feed
postRoutes.get("/", requireUser, getPostFeedHandler);

// Get Users Posts
postRoutes.get(
  "/:id/userPosts",
  requireUser,
  validateResource(getUserPostsSchema),
  getUserPostsHandler
);

export default postRoutes;
