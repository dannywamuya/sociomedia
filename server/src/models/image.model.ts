import mongoose from "mongoose";

export interface IImage {
  path: string;
  userId: string;
  wasProfilePicture: boolean;
  wasPost: boolean;
}

const imageSchema = new mongoose.Schema({
  path: { type: String },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  wasProfilePicture: { type: Boolean, default: false },
  wasPost: { type: Boolean, default: false },
});

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export default ImageModel;
