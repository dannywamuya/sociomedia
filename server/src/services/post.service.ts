import ImageModel from "../models/image.model";
import PostModel, { privatePostFields } from "../models/post.model";
import { IUser } from "../models/user.model";
import { CreatePostInput, UpdatePostInput } from "../schemas/post.schema";

export const createPostSvc = async (
  { description }: CreatePostInput["body"],
  user: IUser & { _id: string }
) => {
  try {
    const { firstName, lastName } = user;

    const post = await PostModel.create({
      description,
      firstName,
      lastName,
      userId: user._id,
    });
    return post;
  } catch (e: any) {
    return e.message;
  }
};

export const updatePostSvc = async (
  { description }: UpdatePostInput["body"],
  { id }: UpdatePostInput["params"],
  user: IUser & { _id: string }
) => {
  try {
    const post = await PostModel.findById(id);

    if (!post || String(post.userId) !== user._id) {
      return "Could not update post";
    }

    post.description = description;
    post.save();

    return post;
  } catch (e: any) {
    return e.message;
  }
};

export const savePostImagesSvc = async (
  userId: string,
  postId: string,
  path: string
) => {
  try {
    return await ImageModel.create({ postId, userId, path });
  } catch (e: any) {
    return e.message;
  }
};

export const updatePostImages = async (
  postId: string,
  picturePaths: string[],
  userId: string
) => {
  try {
    const post = await PostModel.findById(postId, [
      ...privatePostFields.map((v) => `-${v}`),
    ]);

    if (!post || String(post.userId) !== userId) {
      return "Could not update post";
    }

    post.picturePaths = picturePaths;
    post.save();

    return post;
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const getSinglePostSvc = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId, [
      ...privatePostFields.map((v) => `-${v}`),
    ]);

    if (!post) return { status: 404, message: "Could not find post." };

    if (post.archived) {
      return { status: 404, message: "Post has been archived" };
    }

    return { status: 200, post };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const archivePostSvc = async (id: string, userId: string) => {
  try {
    const post = await PostModel.findById(id);
    if (!post) return { status: 404, message: "Could not find post." };

    if (String(post.userId) !== userId) {
      return { status: 403, message: "Could not archive post" };
    }

    post.archived = !post.archived;
    post.save();
    return { status: 200, message: { archived: post.archived } };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const getPostFeedService = async () => {
  try {
    const posts = await PostModel.find(
      {},
      [...privatePostFields.map((v) => `-${v}`)],
      {
        sort: { createdAt: -1 },
      }
    );

    return { status: 200, posts };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const getPostsByUserId = async (userId: string) => {
  try {
    const posts = await PostModel.find(
      { userId },
      [...privatePostFields.map((v) => `-${v}`)],
      {
        sort: { createdAt: -1 },
      }
    );

    return { status: 200, posts };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const likePostSvc = async (postId: string, userId: string) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) return { status: 404, message: "Could not find post." };

    const likes = new Set(post.likes.map((v) => String(v)));
    const liked = likes.has(userId);

    liked ? likes.delete(userId) : likes.add(userId);

    post.likes = [...likes];
    post.save();

    return { status: 200, liked: !liked };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};

export const commentOnPostSvc = async (
  text: string,
  postId: string,
  userId: string
) => {
  try {
    const post = await PostModel.findById(postId);

    if (!post) return { status: 404, message: "Could not find post." };

    post.comments.push({ userId, text });
    post.save();

    return { status: 200, message: "Comment posted successfully" };
  } catch (e: any) {
    return { status: 500, message: e.message };
  }
};
