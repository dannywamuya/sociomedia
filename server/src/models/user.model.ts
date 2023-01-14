import mongoose from "mongoose";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import config from "config";
import { friendSchema, IFriend } from "./friend.model";

export const privateUserFields = [
  "password",
  "passwordResetCode",
  "verificationCode",
  "__v",
  "verified",
];

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  password: string;
  friends: IFriend[];
  picturePath: string;
  occupation: string;
  location: string;
  profileViews: number;
  impressions: number;
  verificationCode: string;
  passwordResetCode: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
      default: () => nanoid(),
    },
    passwordResetCode: {
      type: String,
    },
    verified: {
      type: Boolean,
      // In production, this should be false so as to verify user of real email addresses.
      // In this case, we have to do this because we haven't set up an SMTP server for our email
      // and can therefore not verify users or reset passwords.
      default: true,
    },
    profileViews: { type: Number },
    impressions: { type: Number },
    friends: { type: [friendSchema], ref: "User" },
    picturePath: { type: String },
    occupation: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
  const hash = bcrypt.hashSync(this.password, salt);

  this.password = hash;

  return next();
});

userSchema.methods.validatePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password).catch((e) => false);
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
