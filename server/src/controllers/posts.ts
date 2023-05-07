import { Document, HydratedDocument } from "mongoose";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import { ForbiddenErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { findDocAndUpdate, findDocByIdAndUpdate } from "../utils/findDocs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/reqResInterfaces";

// TODO: add getFeed

export async function addPost(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const { content } = req.body;

  const userToPostTo = await User.findOne({ profilePath }, { canAnyonePost: 1 });
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");

  const createdBy: string = req.data.user.userId;
  await checkIfAllowedToPost(userToPostTo, createdBy);

  const postPath = getPostPath(content);
  const post = new Post({ onUser: userToPostTo.id, createdBy, content, postPath });
  const poster = await findDocByIdAndUpdate(User, createdBy, { $push: { posts: post._id }});
  if (!poster) throw new NotFoundErr("poster not found");

  await post.save();
  res.status(201).json(post);
}

async function checkIfAllowedToPost(userToPostTo: HydratedDocument<IUser>, posterId: string) {
  const userToPostToId = userToPostTo.id;

  if (!userToPostTo.canAnyonePost && posterId !== userToPostToId) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }
}

export async function getPost(req: IReq, res: IRes) {
  const { postPath } = req.params;

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  res.status(200).json(post);
}

export async function getUserPosts(req: IReq, res: IRes) {
  const { profilePath: profilePathToGetPostsFrom } = req.params;

  const user = await User.findOne(
    { profilePath: profilePathToGetPostsFrom }, { posts: 1 }
  );
  if (!user) throw new NotFoundErr("user not found");

  const posts = await Post.find({ createdBy: user.id });
  res.status(200).json(posts);
}

export async function deleteUserPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const userId = req.data.user.userId;

  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");

  const posterId = post.createdBy.toString();
  if (userId !== posterId) {
    throw new ForbiddenErr("you can only delete your own posts");
  }

  const deletedPost = await Post.findByIdAndDelete(post.id);
  res.status(200).json(deletedPost);
}

export async function patchPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const { content } = req.body;
  const userId = req.data.user.userId;

  const updateQuery = { content }
  const updatedPost = await Post.findOneAndUpdate(
    { postPath, createdBy: userId },
    updateQuery,
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    throw new NotFoundErr("this post was not created by you or may not exist");
  }

  res.status(200).json(updatedPost);
}
