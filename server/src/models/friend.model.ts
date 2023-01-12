import mongoose from "mongoose";
import { IImage } from "./image.model";

export interface IFriend {
  firstName: string;
  lastName: string;
  fullName: string;
  picturePath: string;
  occupation: string;
  location: string;
}

export const friendSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  picturePath: { type: String },
  occupation: { type: String },
  location: { type: String },
});

const FriendModel = mongoose.model<IFriend>("Friend", friendSchema);

export default FriendModel;
