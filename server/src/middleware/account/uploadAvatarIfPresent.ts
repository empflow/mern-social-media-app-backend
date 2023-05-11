import { NextFunction } from "express";
import { IUser } from "../../models/User";
import optimizeAvatarAndUploadIn3Sizes from "../../utils/optimizeAvatarAndUploadIn3Sizes";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function uploadAvatarIfPresent(req: IReq, res: IRes, next: NextFunction) {
  if (req.file) {
    const avatarUrls = await optimizeAvatarAndUploadIn3Sizes(req.file.buffer);
    req.data.avatarUrls = avatarUrls;
  }

  next();
}