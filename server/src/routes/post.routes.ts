import express from "express";
import {
  archivePostHandler,
  commentOnPostHandler,
  createPostHandler,
  deletePostHandler,
  getPostFeedHandler,
  getPostHandler,
  getUserPostsHandler,
  likePostHandler,
  updatePostHandler,
  // uploadImagesHandler,
} from "../controllers/post.controller";
import { uploadImagesMiddleWare } from "../middleware/fileUpload";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  commentPostSchema,
  createPostSchema,
  deletePostSchema,
  getPostSchema,
  getUserPostsSchema,
  likePostSchema,
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
postRoutes.get(
  "/:id",
  requireUser,
  validateResource(getPostSchema),
  getPostHandler
);

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
  requireUser,
  validateResource(deletePostSchema),
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

// Like Post
postRoutes.post(
  "/:id/like",
  requireUser,
  validateResource(likePostSchema),
  likePostHandler
);

// Comment Post
postRoutes.post(
  "/:id/comment",
  requireUser,
  validateResource(commentPostSchema),
  commentOnPostHandler
);

// TODO: Implement a handler to delete images for a post
// Delete Post Image

export default postRoutes;
