import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { refreshAccessToken } from "../services/auth.service";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) return next();

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  // Attach user to the response if decoded
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  // Refresh Access Token
  const refreshToken = get(req, "headers.x-refresh");

  if (refreshToken) {
    const newAccessToken = await refreshAccessToken(
      Array.isArray(refreshToken) ? refreshToken[0] : refreshToken
    );

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      const result = verifyJwt<any>(newAccessToken, "accessTokenPublicKey");

      res.locals.user = result;
      return next();
    }
  }

  return res.status(400).send("Could not refresh token");
};

export default deserializeUser;
