import mongoose, { Types } from "mongoose";
import { nanoid } from "nanoid";
import Post from "../models/Post";
import User from "../models/User";
import areAllPromiseResultsFulfilled from "../utils/areAllPromiseResultsFulfilled";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function addPost(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const userToPostTo = await User.findOne(
    { profilePath }, { canAnyonePost: 1 }
  );
  const posterId = req.data.user.userId;
  
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  if (!userToPostTo.canAnyonePost) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }

  const postBody = req.body.body;
  const postPath = getPostPath(postBody);
  const post = new Post({ body: postBody, user: posterId, postPath });
  const poster = await User.findByIdAndUpdate(
    posterId, { $push: { posts: post._id }}, { runValidators: true, new: true }
  );
  if (!poster) throw new NotFoundErr("poster not found");

  await post.save();
  res.status(201).json(post);
}

export async function getUserPosts(req: IReq, res: IRes) {
  const { profilePath: profilePathToGetPostsFrom } = req.params;

  const user = await User.findOne(
    { profilePath: profilePathToGetPostsFrom }, { posts: 1 }
  );
  if (!user) throw new NotFoundErr("user not found");
  const posts = user.posts;

  const postsDocs = await Post.find({ _id: { $in: posts }});
  res.status(200).json(postsDocs);
}

export async function deleteUserPost(req: IReq, res: IRes) {
  const user = req.data.fetchedUser;
  const post = req.data.fetchedPost;
  
  const updatedUserPromise = User.findByIdAndUpdate(
    user._id, { $pull: { posts: post._id }}, { new: true, runValidators: true }
  )
  const deletedPostPromise = Post.deleteOne({ _id: post._id });
  const promiseResults = await Promise.allSettled([updatedUserPromise, deletedPostPromise]);
  
  if (!areAllPromiseResultsFulfilled(promiseResults)) {
    const msg = "could not update the user's list of posts and/or delete the post";
    throw new Error(msg);
  }

  res.status(200).json({ msg: "post deleted successfully" });
}
