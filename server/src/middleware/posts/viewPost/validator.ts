import { NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import Post from "../../../models/Post";
import PostView from "../../../models/PostView";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function viewPostValidator(req: IReq, res: IRes, next: NextFunction) {
  const { postId } = req.params;
  const { userId } = req.data.user;
  if (!isValidObjectId(postId)) throw new BadRequestErr("invalid post id");

  const [postView, post] = await getPostViewAndPost(postId, userId);
  const alreadyViewed = !!postView;
  if (alreadyViewed) throw new BadRequestErr("post already viewed");

  req.data.post = post;
  next();
}


async function getPostViewAndPost(postId: string, userId: string) {
  const postViewPromise = PostView.findOne({ userId, postId });
  const postPromise = Post.findById(postId, { views: 1 });
  return Promise.all([postViewPromise, postPromise]);
}
