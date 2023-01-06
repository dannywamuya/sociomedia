import { omit } from "lodash";
import UserModel, { IUser } from "../models/user.model";

export const createUser = async (input: Partial<IUser>) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), ["password"]);
  } catch (e: any) {
    throw new Error(e);
  }
};

export const findUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};
