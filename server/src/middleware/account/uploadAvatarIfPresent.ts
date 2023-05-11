import { NextFunction } from "express";
import { IUser } from "../../models/User";
import optimizeAvatarAndUploadIn3Sizes from "../../utils/optimizeAvatarAndUploadIn3Sizes";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function uploadAvatarIfPresent(req: IReq, res: IRes, next: NextFunction) {
  if (req.file) {
    const uploadResult = await optimizeAvatarAndUploadIn3Sizes(req.file.buffer);
    const avatarUrls: Partial<IUser> = {
      avatarUrl400px: uploadResult.avatarImgUpload.Location,
      avatarUrl200px: uploadResult.previewImgUpload.Location,
      avatarUrl100px: uploadResult.tinyPreviewImgUpload.Location,
    };
    req.data.avatarUrls = avatarUrls;
  }

  next();
}