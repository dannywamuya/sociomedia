import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schemas/user.schema";
import { createUser, findUserById } from "../services/user.service";
import sendEmail from "../utils/mailer";

export const creatUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    await sendEmail({
      from: "dannytestsmtp@gmail.com",
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
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // Find User by Id
  const user = await findUserById(id);
  if (!user) return res.status(404).send("This user does not exist.");

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
