import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  GetUserInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import {
  followUnfollowUser,
  createUser,
  findUserByEmail,
  findUserById,
  getUserFriends,
} from "../services/user.service";
import logger from "../utils/logger";
import sendEmail from "../utils/mailer";
import { nanoid } from "nanoid";
import config from "config";
import { uploadProfilePictureSVC } from "../services/upload.service";

const fromEmail = config.get<string>("fromEmail");

export const creatUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    await sendEmail({
      from: fromEmail,
      to: user.email,
      subject: "Please verify your account.",
      text: `Verification Code: ${user.verificationCode}, ID: ${
        (user as any)._id
      }`,
    });

    return res.send(user);
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    } else {
      return res.status(500).send(e);
    }
  }
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput["params"]>,
  res: Response
) => {
  const { id, verificationCode } = req.params;

  // Find User by Id
  const user = await findUserById(id);
  if (!user) return res.send("Could not verify user.");

  // Check if user is verified
  if (user.verified) return res.send("User is already verified.");

  // Check if verification code matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();

    return res.send("User verification was successful.");
  }

  return res.send("Could not verify user.");
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput["body"]>,
  res: Response
) => {
  const msg =
    "If a user with that email is verified, they will receive a password reset email.";

  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    logger.debug(`User with email ${email} does not exist`);
    return res.send(msg);
  }

  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    from: fromEmail,
    to: user.email,
    subject: "Reset your password.",
    text: `Password Reset Code: ${passwordResetCode}, ID: ${(user as any)._id}`,
  });

  logger.debug(`Password reset email sent to ${user.email}`);

  return res.send(msg);
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) => {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset password.");
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send("Successfully reset password.");
};

export const getCurrentUserHandler = (req: Request, res: Response) => {
  return res.send(res.locals.user);
};

export const getUser = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  const { id } = req.params;
  const user = await findUserById(id, { hidePrivateFields: true });

  if (!user) res.status(404).send("Could not find user.");

  return res.send(user);
};

export const addRemoveFriend = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  const { id } = req.params;
  const status = await followUnfollowUser(id, res.locals.user._id);

  if (!status) return res.status(404).send("Could not find user.");

  return res.send(status);
};

export const getUserFriendsHandler = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  const { id } = req.params;
  const friends = await getUserFriends(id);

  if (!friends) return res.status(404).send("Could not find user.");

  return res.send(friends);
};

export const uploadProfilePictureHandler = async (
  req: Request,
  res: Response
) => {
  // Get file from request object
  const file: Express.Multer.File | undefined = req?.file;

  if (!file) {
    return res.status(400).send({ message: "Please upload a file!" });
  }

  const { _id } = res.locals.user;

  const { message, url, status } = await uploadProfilePictureSVC(file, _id);

  return res.status(status).send({ message, url });
};
