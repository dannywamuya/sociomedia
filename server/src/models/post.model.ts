import mongoose from "mongoose";

export const privatePostFields = ["__v", "archived"];

interface IComment {
  userId: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

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
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema(
  {
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
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
    },
    comments: {
      type: [commentSchema],
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.pre("save", function (next) {
  if (this.picturePaths.length > 10) {
    return next(new Error("Too many images per post, maximum is 4"));
  }
  next();
});

const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
