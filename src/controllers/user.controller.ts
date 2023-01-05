import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser } from "../services/user.service";

export const creatUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Account already exists");
    } else {
      return res.status(500).send(e);
    }
  }
};
