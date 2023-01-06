import { SignOptions } from "jsonwebtoken";
import { omit } from "lodash";
import { Document, Types } from "mongoose";
import SessionModel from "../models/session.model";
import { IUser, privateUserFields } from "../models/user.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { findUserById } from "./user.service";
import config from "config";

export const createSession = async (userId: Types.ObjectId) => {
  return SessionModel.create({ user: userId });
};

export const findSessionById = async (sessionId: Types.ObjectId) => {
  return SessionModel.findById(sessionId);
};

export const signAccessToken = (
  user: Document<unknown, any, IUser> &
    IUser & {
      _id: Types.ObjectId;
    },
  options?: SignOptions
): string => {
  const payload = omit(user.toJSON(), privateUserFields);
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

export const refreshAccessToken = async (
  token: string
): Promise<null | string> => {
  const decoded = verifyJwt<{ session: Types.ObjectId }>(
    token,
    "refreshTokenPublicKey"
  );

  if (!decoded) return null;

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) return null;

  const user = await findUserById(String(session.user));

  if (!user) return null;

  return signAccessToken(user, {
    expiresIn: config.get<string>("accessTokenTtl"),
  });
};
