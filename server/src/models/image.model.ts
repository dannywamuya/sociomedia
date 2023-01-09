import mongoose from "mongoose";

export interface IImage {
  path: string;
}

const imageSchema = new mongoose.Schema({
  path: { type: String },
});

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export default ImageModel;
