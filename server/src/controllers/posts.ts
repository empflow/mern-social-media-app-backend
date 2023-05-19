import { Document, HydratedDocument } from "mongoose";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import { BadRequestErr, ForbiddenErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { findDocAndUpdate, findDocByIdAndUpdate } from "../utils/findDocs";
import optimizeAndUploadPostImgs from "../utils/optimizeAndUploadPostImgs";
import { getPostPath } from "../utils/pathsGenerators";
import { IReq, IRes } from "../utils/reqResInterfaces";


// TODO: add getFeed

export async function addPost(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const { content } = req.body;
  const createdBy: string = req.data.user.userId;

  checkIfAnyContentIsProvided(req);

  const userToPostTo = await User.findOne({ profilePath });
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  await checkIfAllowedToPost(userToPostTo, createdBy);
  
  const poster = await User.findById(createdBy);
  if (!poster) throw new NotFoundErr("poster not found");

  const { tinyPreview, imgs } = await uploadImgsIfPresent(req.files);

  const postPath = getPostPath(content);
  const post = new Post({
    onUser: userToPostTo.id, createdBy, content, postPath, tinyPreview, imgs
  });

  await post.save();
  res.status(201).json(post);
}


function checkIfAnyContentIsProvided(req: IReq) {
  if (!req.body.content && !req.file && !req.files) {
    throw new BadRequestErr("no content was provided");
  }
}


async function uploadImgsIfPresent(
  imgs: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[] | undefined
) {
  if (!imgs?.length) return { tinyPreview: undefined, imgs: undefined };

  const buffers = (imgs as Express.Multer.File[]).map(img => img.buffer);
  return optimizeAndUploadPostImgs(buffers);
}


async function checkIfAllowedToPost(userToPostTo: IUser, posterId: string) {
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

  const update = { content };
  const updatedPost = await Post.findOneAndUpdate(
    { postPath },
    update,
    { new: true, runValidators: true }
  );
  res.status(200).json(updatedPost);
}
