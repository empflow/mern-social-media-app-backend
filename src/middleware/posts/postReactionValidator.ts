import { NextFunction } from "express";
import Post from "../../models/Post";
import User from "../../models/User";
import { NotFoundErr } from "../../utils/errs";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function postReactionValidator(req: IReq, res: IRes, next: NextFunction) {
  const { userId } = req.data.user;
  const { postPath } = req.params;
  const [user, post] = await getUserAndPost(userId, postPath);

  if (!user) throw new NotFoundErr("user not found");
  if (!post) throw new NotFoundErr("post not found");
  req.data.post = post;
  req.data.user = user;
  req.data.likedByStrIds = post.likedBy.map(id => id.toString());
  req.data.dislikedByStrIds = post.dislikedBy.map(id => id.toString());

  next();
}


async function getUserAndPost(userId: string, postPath: string) {
  const userPromise = User.findById(userId);
  const postPromise = Post.findOne({ postPath });
  return Promise.all([userPromise, postPromise]);
}
