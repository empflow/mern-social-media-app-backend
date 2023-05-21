import { NextFunction } from "express";
import { IPost } from "../../../models/Post";
import deepCopy from "../../../utils/deepCopy";
import { IOptimizeAndUploadPostImgsReturnType } from "../../../utils/optimizeAndUploadPostImgs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function patchPostAppendNewImgs(req: IReq, res: IRes, next: NextFunction) {
  const { upload, post }: { upload: IOptimizeAndUploadPostImgsReturnType, post: IPost } = req.data;

  if (!upload.imgs) return next();

  upload.imgs.forEach((upload) => {
    post.imgs.push(upload);
  });

  req.data.post = post;
  next();
}
