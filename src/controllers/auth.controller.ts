import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/auth.schema";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";
import config from "config";

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput["body"]>,
  res: Response
) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  const msg = "Invalid email or password.";

  if (!user) return res.send(msg);

  if (!user.verified) return res.send("Please verify your email.");

  const isValid = user.validatePassword(password);

  if (!isValid) return res.send(msg);

  // create access token
  const accessToken = signAccessToken(user, {
    expiresIn: config.get<string>("accessTokenTtl"),
  });

  // create refresh token
  const refreshToken = await signRefreshToken(user._id, {
    expiresIn: config.get<string>("refreshTokenTtl"),
  });

  return res.send({ accessToken, refreshToken });
};
