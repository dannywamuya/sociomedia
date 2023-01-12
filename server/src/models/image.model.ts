import mongoose from "mongoose";

export interface IImage {
  path: string;
  userId: string;
}

const imageSchema = new mongoose.Schema({
  path: { type: String },
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export default ImageModel;
