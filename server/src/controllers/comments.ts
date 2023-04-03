import Comment from "../models/Comment";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/reqResInterfaces";

export async function getComments(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const comments = await Comment.find({ onPost: postPath });
  res.status(200).json(comments);
}

export async function addComment(req: IReq, res: IRes) {
  const { postPath } = req.params;
  let { replyTo, commentBody } = req.body;
  const userId: string = req.data.user.userId
  if (replyTo) {
    const hostComment = await Comment.findById(replyTo)
    const msg = "Comment you're trying to reply to does not exist";
    if (!hostComment) throw new NotFoundErr(msg)
  }
  
  const comment = await Comment.create({  
    createdBy: userId, onPost: postPath, commentBody, replyTo
  });
  res.status(200).json(comment);
}