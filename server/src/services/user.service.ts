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
      return await UserModel.findById(id, [
        ...privateUserFields.map((v) => `-${v}`),
        "-friends",
      ]);
    }
  }
  return await UserModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const followUnfollowUser = async (id: string, self: string) => {
  const user1 = await UserModel.findById(id);
  const user2 = await UserModel.findById(self);

  if (user1 && user2) {
    const user1Followers = user1.friends.map((v) => String((v as any)._id));
    const follows = !!user1Followers.find((v) => v === self);

    if (!follows) {
      user1.friends.push(user2);
      user1.save();
      return "Followed";
    } else {
      user1.friends = user1.friends.filter(
        (v) => String((v as any)._id) !== self
      );
      user1.save();
      return "Unfollowed";
    }
  } else {
    return undefined;
  }
};
