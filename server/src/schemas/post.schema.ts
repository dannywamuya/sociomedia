import { object, string, TypeOf } from "zod";

export const createPostSchema = object({
  body: object({
    description: string({
      required_error: "Post description must be provided.",
    }).max(280, "You have exceeded the maximum character limit per post."),
  }),
});

export const getPostSchema = object({
  params: object({
    id: string({
      required_error: "Post ID is required",
    }),
  }),
});

export const updatePostSchema = object({
  body: object({
    description: string({
      required_error: "Post description must be provided.",
    }).max(280, "You have exceeded the maximum character limit per post."),
  }),
  params: object({
    id: string({
      required_error: "Post ID is required",
    }),
  }),
});

export const deletePostSchema = object({
  params: object({
    id: string({
      required_error: "Post ID is required",
    }),
  }),
});

export const archivePostSchema = object({
  params: object({
    id: string({
      required_error: "Post ID is required",
    }),
  }),
});

export const getUserPostsSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;

export type GetPostInput = TypeOf<typeof getPostSchema>;

export type UpdatePostInput = TypeOf<typeof updatePostSchema>;

export type DeletePostInput = TypeOf<typeof deletePostSchema>;

export type ArchivePostInput = TypeOf<typeof archivePostSchema>;

export type GetUserPostInput = TypeOf<typeof getUserPostsSchema>;
