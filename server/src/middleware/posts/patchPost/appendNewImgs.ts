import { NextFunction } from "express";
import mongoose, { Schema } from "mongoose";
import { IPost, IPostImg } from "../../../models/Post";
import { IOptimizeAndUploadPostImgsReturnType } from "../../../utils/optimizeAndUploadPostImgs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function patchPostAppendNewImgs(req: IReq, res: IRes, next: NextFunction) {
  const { upload, post }: { upload: IOptimizeAndUploadPostImgsReturnType, post: IPost } = req.data;

  if (!upload.imgs) return next();

  upload.imgs.forEach((imgObj) => {
    const imgObjWithId: IPostImg = { ...imgObj, _id: new mongoose.Types.ObjectId() }
    post.imgs.push(imgObjWithId);
  });

  req.data.post = post;
  next();
}
