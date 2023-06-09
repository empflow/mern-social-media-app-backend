import { NextFunction } from "express";
import Post from "../../../models/Post";
import User from "../../../models/User";
import { BadRequestErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function likePostValidator(req: IReq, res: IRes, next: NextFunction) {
  const userId = req.data.user.userId;
  const { postPath } = req.params;
  const [user, post] = await getUserAndPost(userId, postPath);
  if (!user) throw new NotFoundErr("user not found");
  if (!post) throw new NotFoundErr("post not found");
  req.data.post = post;
  req.data.user = user;

  if (post.likedBy.includes(userId)) {
    throw new BadRequestErr("you have already liked this post");
  }
  next();
}


async function getUserAndPost(userId: string, postPath: string) {
  const userPromise = User.findById(userId);
  const postPromise = Post.findOne({ postPath });
  return Promise.all([userPromise, postPromise]);
}