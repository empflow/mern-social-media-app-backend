import { Types } from "mongoose";
import Post from "../models/Post";
import User from "../models/User";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function addPost(req: IReq, res: IRes) {
  const { profilePath: profilePathToPostTo } = req.params;
  const posterId = req.data.user.userId;
  const userToPostTo = await User.findOne(
    { profilePath: profilePathToPostTo }, { canAnyonePost: 1 }
  );
  
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  if (!userToPostTo.canAnyonePost) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }

  const post = new Post({ ...req.body, user: posterId });
  const poster = await User.findByIdAndUpdate(
    posterId, { $push: { posts: post._id }}, { runValidators: true, new: true }
  );
  if (!poster) throw new NotFoundErr("poster not found");
  post.save();
  res.status(201).json(post);
}

export async function getUserPosts(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const posts = User.findOne({ profilePath }, { posts: 1 });
  res.status(200).json(posts);
}