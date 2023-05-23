import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { IComment, ICommentImg } from "../models/Comment";
import deepCopy from "../utils/deepCopy";
import optimizeAndUploadCommentImgs from "../utils/optimizeAndUploadCommentImgs";
import { IReq, IRes } from "../utils/reqResInterfaces";


export default async function commentUploadImgsIfPresent(req: IReq, res: IRes, next: NextFunction) {
  if (!req.files || !req.files.length) return next();

  const imgs = req.files;
  const buffers = (imgs as Express.Multer.File[]).map(img => img.buffer);
  const uploadResult = await optimizeAndUploadCommentImgs(buffers);
  
  req.data.upload = deepCopy(uploadResult);
  next();
}
