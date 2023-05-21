import { NextFunction } from "express";
import Post, { IPost } from "../../../models/Post";
import { BadRequestErr, ForbiddenErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import validateFileCount from "../../../utils/validateFileCount";

export default async function patchPostValidator(req: IReq, res: IRes, next: NextFunction) {
  const post = await getPostAndCheckItExists(req);
  validatePatchingOwnPost(req, post);
  validateFileCount(req, post);

  req.data.post = post;
  next();
}


async function getPostAndCheckItExists(req: IReq) {
  const { postPath } = req.params;
  const post = await Post.findOne({ postPath });
  if (!post) throw new NotFoundErr("post not found");
  return post;
}


function validatePatchingOwnPost(req: IReq, post: IPost) {
  const { userId } = req.data.user;
  if (userId !== post.createdBy.toString()) {
    throw new BadRequestErr("you can only update your own posts");
  }
}
