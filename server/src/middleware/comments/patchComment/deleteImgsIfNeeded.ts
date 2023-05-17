import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import Comment, { IComment, ICommentImg } from "../../../models/Comment";
import deepCopy from "../../../utils/deepCopy";
import { findDocByIdAndUpdate } from "../../../utils/findDocs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import { convertFilesToDeleteIdsToArr } from "./validator";

export default async function patchCommentDeleteImgsIfNeeded(req: IReq, res: IRes, next: NextFunction) {
  const { filesToDeleteIds } = req.body;
  const { commentId } = req.params;
  const filesToDeleteIdsArr = convertFilesToDeleteIdsToArr(filesToDeleteIds);
  const comment: HydratedDocument<IComment> = deepCopy(req.data.comment);
  const updatedImgsArr = deepCopy(comment.imgs)
    .filter(imgObj => filterImgs(imgObj, filesToDeleteIdsArr));

  comment.imgs = updatedImgsArr;

  req.data.comment = deepCopy(comment);
  next();
}


function filterImgs(imgObj: ICommentImg, filesToDeleteIds: string[]) {
  const id = (imgObj as any)._id;
  if (filesToDeleteIds.includes(id)) return false;
  return true;
}
