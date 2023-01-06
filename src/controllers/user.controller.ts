import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser } from "../services/user.service";
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
