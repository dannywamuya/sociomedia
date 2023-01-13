import mongoose from "mongoose";

interface IComment {
  userId: string;
  text: string;
}

export interface IPost {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  userPicturePath: string;
  picturePaths: string[];
  likes: string[];
  comments: IComment[];
  archived: boolean;
}

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  firstName: {
    type: String,
    required: true,
    immutable: true,
  },
  lastName: {
    type: String,
    required: true,
    immutable: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  userPicturePath: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Image",
  },
  picturePaths: {
    type: [String],
  },
  likes: {
    type: [mongoose.SchemaTypes.Array],
    ref: "User",
  },
  comments: {
    type: mongoose.SchemaTypes.Array,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

postSchema.pre("save", function (next) {
  if (this.picturePaths.length > 10) {
    return next(new Error("Too many images per post, maximum is 10"));
  }
  next();
});

const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
