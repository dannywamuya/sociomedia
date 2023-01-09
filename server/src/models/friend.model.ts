import mongoose from "mongoose";
import { IImage } from "./image.model";

export interface IFriend {
  firstName: string;
  lastName: string;
  fullName: string;
  picturePath: IImage;
  occupation: string;
  location: string;
}

// const friendSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   picturePath: { type: mongoose.SchemaTypes.ObjectId, ref: "Image" },
//   occupation: { type: String },
//   location: { type: String },
// });

// const FriendModel = mongoose.model<IFriend>("Friend", friendSchema);

// export default FriendModel;
