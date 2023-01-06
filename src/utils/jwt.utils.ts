import jwt from "jsonwebtoken";
import config from "config";
import logger from "./logger";

export type PrivateKeyName = "accessTokenPrivateKey" | "refreshTokenPrivateKey";
export type PublicKeyName = "accessTokenPublicKey" | "refreshTokenPublicKey";

export const signJwt = (
  payload: Object,
  keyName: PrivateKeyName,
  options?: jwt.SignOptions
) => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return jwt.sign(payload, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = (token: string, keyName: PublicKeyName) => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  try {
    const decoded = jwt.verify(token, signingKey);
    return decoded;
  } catch (e) {
    logger.error(e);
    return null;
  }
};
