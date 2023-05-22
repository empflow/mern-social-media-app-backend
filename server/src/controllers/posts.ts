import { Document, HydratedDocument } from "mongoose";
import postUploadImgsIfPresent from "../middleware/posts/uploadImgsIfPresent";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import { BadRequestErr, ForbiddenErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { findDocAndUpdate, findDocByIdAndUpdate } from "../utils/findDocs";
import optimizeAndUploadPostImgs from "../utils/optimizeAndUploadPostImgs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/reqResInterfaces";


// TODO: add getFeed

export async function addPost(req: IReq, res: IRes) {
  const { content } = req.body;
  const createdBy: string = req.data.user.userId;
  const userToPostTo: IUser = req.data.userToPostTo;
  const { tinyPreview, imgs } = req.data.upload;

  const postPath = getPostPath(content);
  const post = new Post({
    onUser: userToPostTo.id, createdBy, content, postPath, tinyPreview, imgs
  });

  await post.save();
  res.status(201).json(post);
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
  const post = req.data.post.toObject();

  const updatedPost = await findDocAndUpdate(
    Post,
    { postPath },
    { ...post, content }
  );
  res.status(200).json(updatedPost);
}
