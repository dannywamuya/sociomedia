import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import logger from "../utils/logger";
import sendEmail from "../utils/mailer";
import { nanoid } from "nanoid";
import config from "config";

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
