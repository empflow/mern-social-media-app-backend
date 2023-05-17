import { NextFunction } from "express";
import Comment from "../../../models/Comment";
import { findDocByIdAndUpdate } from "../../../utils/findDocs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default async function patchPostDeleteImgsIfNeeded(req: IReq, res: IRes, next: NextFunction) {
  const { deleteImgsIds } = req.body;
  const { commentId } = req.params;

  const updatedComment = await findDocByIdAndUpdate(
    Comment,
    commentId,
    { $pull: { imgs: { _id: deleteImgsIds } }}
  )

  next();
}