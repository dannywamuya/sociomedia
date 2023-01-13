import jwt from "jsonwebtoken";
import config from "config";

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

export const verifyJwt = <T>(
  token: string,
  keyName: PublicKeyName
): T | null => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  try {
    return jwt.verify(token, signingKey) as T;
  } catch (e: any) {
    return null;
  }
};
