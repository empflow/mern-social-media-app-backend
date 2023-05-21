import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { IComment, ICommentImg } from "../../../models/Comment";
import deepCopy from "../../../utils/deepCopy";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default function patchCommentAppendNewImgsToComment(req: IReq, res: IRes, next: NextFunction) {
  const comment: IComment = deepCopy(req.data.comment);
  const uploadResult: ICommentImg[] | undefined = deepCopy(req.data.upload);

  // TODO: check if this check is necessary
  if (uploadResult) {
    uploadResult.forEach(imgUpload => {
      comment.imgs.push(imgUpload);
    })
    console.log(comment.imgs);
  }
  
  req.data.comment = deepCopy(comment);
  next();
}
