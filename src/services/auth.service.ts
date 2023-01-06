import { SignOptions } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import SessionModel from "../models/session.model";
import { IUser } from "../models/user.model";
import { signJwt } from "../utils/jwt.utils";

export const createSession = async (userId: Types.ObjectId) => {
  return SessionModel.create({ user: userId });
};

export const signAccessToken = (
  user: Document<unknown, any, IUser> &
    IUser & {
      _id: Types.ObjectId;
    },
  options?: SignOptions
) => {
  const payload = user.toJSON();
  const accessToken = signJwt(payload, "accessTokenPrivateKey", options);

  return accessToken;
};

export const signRefreshToken = async (
  userId: Types.ObjectId,
  options: SignOptions
) => {
  const session = await createSession(userId);

  const refreshToken = signJwt(
    { session: session._id },
    "refreshTokenPrivateKey",
    options
  );

  return refreshToken;
};
