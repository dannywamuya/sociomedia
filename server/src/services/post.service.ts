import ImageModel from "../models/image.model";
import PostModel from "../models/post.model";
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
    const post = await PostModel.findById(postId);

    if (!post || String(post.userId) !== userId) {
      return "Could not update post";
    }

    post.picturePaths = picturePaths;
    post.save();
    return post;
  } catch (e: any) {
    return e.message;
  }
};