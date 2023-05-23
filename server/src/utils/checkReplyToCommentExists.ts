import Comment from "../models/Comment";
import { NotFoundErr } from "./errs";


export default async function checkReplyToCommentExists(
  replyTo: string | undefined, opts?: { shouldReturnBool: boolean }
) {
  const { shouldReturnBool = false } = opts ?? {};
  
  if (shouldReturnBool && !replyTo) return false;
  if (!replyTo) return;

  const comment = await Comment.findById(replyTo);
  
  if (shouldReturnBool) {
    if (!replyTo) return false;
    if (!comment) return false;
    return true;
  }
  if (!comment) throw new NotFoundErr("comment you're trying to reply to does not exist");
}
