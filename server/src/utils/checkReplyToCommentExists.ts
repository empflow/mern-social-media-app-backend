import { NextFunction } from "express";
import Comment from "../models/Comment";
import { NotFoundErr } from "./errs";
import { IReq, IRes } from "./reqResInterfaces";


export default async function checkReplyToCommentExists(replyTo: string | undefined) {
  if (!replyTo) return;
  
  const comment = await Comment.findById(replyTo);
  if (!comment) throw new NotFoundErr("comment you're trying to reply to does not exist");
}
