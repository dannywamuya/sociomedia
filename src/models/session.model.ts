import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface ISession {
  user: IUser;
  valid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    valid: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model<ISession>("Session", sessionSchema);

export default SessionModel;
