import mongoose from "mongoose";

export interface IImage {
  path: string;
  userId: string;
  wasProfilePicture: boolean;
  postId: string;
}

const imageSchema = new mongoose.Schema({
  path: { type: String },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  wasProfilePicture: { type: Boolean, default: false },
  postId: { type: mongoose.SchemaTypes.ObjectId, ref: "Post" },
});

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export default ImageModel;
