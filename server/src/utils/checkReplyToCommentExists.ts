import Comment from "../models/Comment";
import { NotFoundErr } from "./errs";


export default async function checkReplyToCommentExists(
  replyTo: string | undefined, opts?: { shouldReturnBool: boolean }
) {
  const errMsg = "comment you're trying to reply to does not exist";
  const { shouldReturnBool = false } = opts ?? {};
  
  if (shouldReturnBool && !replyTo) return false;
  if (replyTo === undefined) return;

  const comment = await Comment.findById(replyTo, { _id: 1 });

  if (shouldReturnBool) {
    if (comment) return true;
    return false;
  }
  
  if (!comment) throw new NotFoundErr(errMsg);
}
