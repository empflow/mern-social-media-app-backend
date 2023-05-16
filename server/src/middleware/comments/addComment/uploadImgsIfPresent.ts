import { NextFunction } from "express";
import optimizeAndUploadCommentImgs from "../../../utils/optimizeAndUploadCommentImgs";
import optimizeAndUploadPostImgs from "../../../utils/optimizeAndUploadPostImgs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function addCommentUploadImgsIfPresent(req: IReq, res: IRes, next: NextFunction) {
  if (!req.files || !req.files.length) return next();

  const imgs = req.files;
  const buffers = (imgs as Express.Multer.File[]).map(img => img.buffer);
  const uploadResult = await optimizeAndUploadCommentImgs(buffers);

  req.data.upload = uploadResult;
  return next();
}
