import mongoose from "mongoose";

export interface IPost {
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  location: string;
  userPicturePath: string;
  picturePaths: string[];
  likes: string[];
  comments: string[];
}

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Image",
  },
  likes: {
    type: mongoose.SchemaTypes.Array,
  },
  comments: {
    type: mongoose.SchemaTypes.Array,
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
