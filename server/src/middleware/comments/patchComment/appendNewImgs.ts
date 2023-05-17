import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { IComment, ICommentImg } from "../../../models/Comment";
import deepCopy from "../../../utils/deepCopy";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default function patchCommentAppendNewImgsToCommentIfNeeded(req: IReq, res: IRes, next: NextFunction) {
  const comment: HydratedDocument<IComment> = deepCopy(req.data.comment);
  const uploadResult: ICommentImg[] | undefined = deepCopy(req.data.upload);

  if (uploadResult) {
    uploadResult.forEach(imgUpload => {
      comment.imgs.push(imgUpload);
    })
  }
  
  req.data.comment = deepCopy(comment);
  next();
}
