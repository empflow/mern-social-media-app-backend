import Comment from "../models/Comment";
import Post from "../models/Post";
import { NotFoundErr } from "../utils/errs";
import { findDocByIdAndUpdate } from "../utils/findDocs";
import { IReq, IRes } from "../utils/reqResInterfaces";


export async function getComments(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const comments = await Comment.find({ onPost: postPath });
  res.status(200).json(comments);
}


export async function addComment(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const { replyTo, content } = req.body;
  const userId: string = req.data.user.userId
  if (replyTo) {
    const hostComment = await Comment.findById(replyTo)
    const msg = "the comment you're trying to reply to does not exist";
    if (!hostComment) throw new NotFoundErr(msg)
  };

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");
  
  const comment = await Comment.create({  
    createdBy: userId, onPost: postPath, content, replyTo
  });
  res.status(201).json(comment);
}


export async function patchComment(req: IReq, res: IRes) {
  const { commentId } = req.params;
  const { content, replyTo, videoAttachments, imageAttachments } = req.body;

  const updatedComment = await findDocByIdAndUpdate(
    Comment,
    commentId,
    { content, replyTo, videoAttachments, imageAttachments }
  )
  if (!updatedComment) throw new NotFoundErr("comment not found");

  res.status(200).json(updatedComment);
}


export async function deleteComment(req: IReq, res: IRes) {
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) throw new NotFoundErr("comment not found");

  res.status(200).json(deletedComment);
}
