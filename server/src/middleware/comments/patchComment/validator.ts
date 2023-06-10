import { NextFunction } from "express";
import Comment, { IComment } from "../../../models/Comment";
import validateObjectId from "../../../utils/validateObjectId";
import checkReplyToCommentExists from "../../../utils/checkReplyToCommentExists";
import deepCopy from "../../../utils/deepCopy";
import { BadRequestErr, ForbiddenErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import validateFileCount from "../../../utils/validateFileCount";
import validateFilesToDeleteIds from "../../../utils/validateFilesToDeleteIds";
import getNewContentOnUpdate from "../../../utils/getNewContentOnUpdate";


export default async function patchCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { commentId } = req.params;
  const { replyTo: replyToCommentId } = req.body;

  throwIfNoNewContentProvided(req);
  validateObjectId(commentId);
  if (replyToCommentId) validateObjectId(replyToCommentId);

  const [comment] = await getCommentAndCheckReplyToCommentExists(commentId, replyToCommentId);
  if (!comment) throw new NotFoundErr("comment not found");

  checkTryingToPatchOwnComment(req, comment);
  validateFileCount(req, comment);
  validateFilesToDeleteIds(req, comment);

  req.data.comment = comment;
  req.data.content = getNewContentOnUpdate(req);
  next();
}


function throwIfNoNewContentProvided(req: IReq) {
  const errMsg = "no content provided";
  const { filesToDeleteIds, content, replyTo } = req.body;

  const noFiles = !req.files?.length;
  if (noFiles && !filesToDeleteIds && !replyTo) {
    if (typeof content === "string" && !content.trim()) {
      throw new BadRequestErr(errMsg);
    } else if (content === undefined) {
      throw new BadRequestErr(errMsg);
    }
  }
}


function getCommentAndCheckReplyToCommentExists(commentId: string, replyToCommentId: string) {
  return Promise.all([
    Comment.findById(commentId),
    checkReplyToCommentExists(replyToCommentId)
  ])
}


function checkTryingToPatchOwnComment(req: IReq, comment: IComment) {
  const { userId } = req.data.user;
  const { createdBy: createdByObj } = comment;
  const createdBy = createdByObj.toString();

  if (userId !== createdBy) {
    throw new ForbiddenErr("you can only update your own comments");
  }
}
