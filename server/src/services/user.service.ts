import { omit } from "lodash";
import UserModel, { IUser, privateUserFields } from "../models/user.model";

interface IFindUserOptions {
  hidePrivateFields?: boolean;
}

export const createUser = async (input: Partial<IUser>) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), ["password"]);
  } catch (e: any) {
    throw new Error(e);
  }
};

export const findUserById = async (id: string, options?: IFindUserOptions) => {
  if (options) {
    const { hidePrivateFields } = options;
    if (hidePrivateFields) {
      return await UserModel.findById(
        id,
        privateUserFields.map((v) => `-${v}`)
      );
    }
  }
  return await UserModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};
