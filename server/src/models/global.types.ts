import { IUser } from "./user.model";

export interface MyLocals extends Record<string, any> {
  user: IUser & { _id: string };
}

export interface IUploadResult {
  status: number;
  message: string;
  url: string | undefined;
}

export interface IPostImages {
  successfulUploads: IUploadResult[];
  failedUploads: IUploadResult[];
}
