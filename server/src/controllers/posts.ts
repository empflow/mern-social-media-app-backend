import Post from "../models/Post";
import User from "../models/User";
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
  console.log(`posterId ${posterId}`)
  console.log(`userToPostToId ${userToPostTo._id}`)
  const userToPostToId = userToPostTo._id.toString();
  if (!userToPostTo.canAnyonePost && posterId !== userToPostToId) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }

  const postBody = req.body.body;
  const postPath = getPostPath(postBody);
  const post = new Post({ body: postBody, createdBy: posterId, postPath });
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
  console.log("get user posts");
  const postsDocs = await Post.find({ _id: { $in: posts }});
  res.status(200).json(postsDocs);
}

export async function deleteUserPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  const userId = req.data.user.userId;

  const post = await Post.findOne({ postPath }, { _id: 1 });
  if (!post) throw new NotFoundErr("post not found");

  const updatedUserPromise = User.updateOne(
    { _id: userId }, { $pull: { posts: post._id }}, { runValidators: true }
  )
  const postDeletionPromise = Post.deleteOne({ _id: post._id });

  try {
    await Promise.all([updatedUserPromise, postDeletionPromise]);
    res.status(200).json({ msg: "post deleted successfully" });
  } catch (err) {
    throw new Error("could not properly delete post");
  }
}

export async function patchPost(req: IReq, res: IRes) {
  const { postPath } = req.params;
  
  const updatedPost = await Post.findOneAndUpdate(
    { postPath }, req.body, { new: true, runValidators: true }
  )
  if (!updatedPost) throw new NotFoundErr("post not found");

  res.status(200).json(updatedPost);
}
