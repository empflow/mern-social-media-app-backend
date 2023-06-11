import { NextFunction } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import { IComment, ICommentImg, ICommentImgNoId } from "../../../models/Comment";
import deepCopy from "../../../utils/deepCopy";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default function patchCommentAppendNewImgsToComment(req: IReq, res: IRes, next: NextFunction) {
  const comment: IComment = deepCopy(req.data.comment);
  const uploadResult: ICommentImgNoId[] | undefined = req.data.upload;

  if (uploadResult) {
    uploadResult.forEach(upload => {
      const uploadWithId = { ...upload, _id: new mongoose.Types.ObjectId() }
      comment.imgs.push(uploadWithId);
    })
  }
  
  req.data.comment = deepCopy(comment);
  next();
}
