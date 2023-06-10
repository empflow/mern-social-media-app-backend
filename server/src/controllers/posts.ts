import { Document, HydratedDocument, Types } from "mongoose";
import postUploadImgsIfPresent from "../middleware/posts/postUploadImgsIfPresent";
import Post, { IPost } from "../models/Post";
import PostView from "../models/PostView";
import User, { IUser } from "../models/User";
import { BadRequestErr, ForbiddenErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { findDocAndUpdate, findDocByIdAndUpdate } from "../utils/findDocs";
import optimizeAndUploadPostImgs from "../utils/optimizeAndUploadPostImgs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/reqResInterfaces";


export async function getFeed(req: IReq, res: IRes) {
  const { page } = req.body;
  const postsPerReq = 6;
  const postsToSkip = (page - 1) * postsPerReq;

  const posts = await Post
    .find()
    .skip(postsToSkip)
    .limit(postsPerReq)
    .sort({ createdAt: -1 });

  res.status(200).json(posts);
}


export async function addPost(req: IReq, res: IRes) {
  const { content } = req.body;
  const createdBy: string = req.data.user.userId;
  const userToPostTo: IUser = req.data.userToPostTo;
  const { tinyPreview, imgs } = req.data.upload;

  const postPath = getPostPath(content);
  const post = await Post.create({
    onUser: userToPostTo.id, createdBy, content, postPath, tinyPreview, imgs
  });

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


export async function likePost(req: IReq, res: IRes) {
  const post: IPost = req.data.post;
  const { user, dislikedByStrIds }: { user: IUser, dislikedByStrIds: string[] } = req.data;
  
  if (dislikedByStrIds.includes(user.id)) {
    post.dislikes -= 1;
    post.dislikedBy = filterOutId(post.dislikedBy, user.id);
  }
  post.likes += 1;
  post.likedBy.push(user.id);
  await post.save();

  res.status(200).json(post);
}


export async function dislikePost(req: IReq, res: IRes) {
  const post: IPost = req.data.post;
  const { user, likedByStrIds }: { user: IUser, likedByStrIds: string[] } = req.data;

  if (likedByStrIds.includes(user.id)) {
    post.likes -= 1;
    post.likedBy = filterOutId(post.likedBy, user.id);
  }
  post.dislikes += 1;
  post.dislikedBy.push(user.id);
  await post.save();

  res.status(200).json(post);
}


export async function removeReaction(req: IReq, res: IRes) {
  const post: IPost = req.data.post;
  const user: IUser = req.data.user;
  const { likedByStrIds, dislikedByStrIds }: { likedByStrIds: string[], dislikedByStrIds: string[] } = req.data;

  if (likedByStrIds.includes(user.id)) {
    post.likedBy = filterOutId(post.likedBy, user.id);
    post.likes -= 1;
  }
  if (dislikedByStrIds.includes(user.id)) {
    post.dislikedBy = filterOutId(post.dislikedBy, user.id);
    post.dislikes -= 1;
  }

  await post.save();
  res.status(200).json(post);
}

function filterOutId(arr: Types.ObjectId[], idToFilterOut: string | Types.ObjectId) {
  return arr.filter(id => id.toString() !== idToFilterOut.toString());
}


export async function viewPost(req: IReq, res: IRes) {
  const { postId } = req.params;
  const { userId } = req.data.user;

  const postUpdateMsgPromise = Post.updateOne({ _id: postId }, { $inc: { views: 1 }});
  const postViewPromise = PostView.create({ postId, userId });
  
  const [postUpdateMsg] = await Promise.all([postUpdateMsgPromise, postViewPromise]);
  if (!postUpdateMsg.modifiedCount) throw new NotFoundErr("post not found");

  res.status(200).json({ ok: true });
}
