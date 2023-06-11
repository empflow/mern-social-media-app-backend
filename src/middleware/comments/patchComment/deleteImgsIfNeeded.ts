import { NextFunction } from "express";
import { Document, HydratedDocument } from "mongoose";
import Comment, { IComment, ICommentImg } from "../../../models/Comment";
import convertFilesToDeleteIdsToArr from "../../../utils/convertFilesToDeleteIdsToArr";
import deepCopy from "../../../utils/deepCopy";
import { findDocByIdAndUpdate } from "../../../utils/findDocs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


interface IReqBody {
  filesToDeleteIds: string | string[] | undefined
}

export default async function patchCommentDeleteImgsIfNeeded(req: IReq, res: IRes, next: NextFunction) {
  const { filesToDeleteIds }: IReqBody = req.body;
  const filesToDeleteIdsArr = convertFilesToDeleteIdsToArr(filesToDeleteIds);
  const comment: HydratedDocument<IComment> = deepCopy(req.data.comment);
  comment.imgs = comment.imgs
    .filter(imgObj => filterImgs(imgObj, filesToDeleteIdsArr));

  req.data.comment = comment;
  next();
}


function filterImgs(imgObj: ICommentImg, filesToDeleteIds: string[]) {
  const id = imgObj._id.toString();

  if (filesToDeleteIds.includes(id.toString())) return false;
  return true; // include if the img id is not contained in the array of ids of imgs to delete
}
