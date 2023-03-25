import { NextFunction } from "express";
import Post from "../models/Post";
import User from "../models/User";
import areAllPromiseResultsFulfilled from "../utils/areAllPromiseResultsFulfilled";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function checkUserAndPostBeforeDeletingPost(
  req: IReq, res: IRes, next: NextFunction
) {
  const { profilePath, postPath } = req.params;

  const userPromise = User.findOne({ profilePath }, { _id: 1 });
  const postPromise = Post.findOne({ postPath }, { _id: 1 });
  const promiseResults = await Promise.allSettled([userPromise, postPromise]);

  if (!areAllPromiseResultsFulfilled(promiseResults)) {
    throw new Error("could not fetch some data");
  }

  const user = (promiseResults[0] as PromiseFulfilledResult<any>).value;
  const post = (promiseResults[1] as PromiseFulfilledResult<any>).value;
  if (!user) throw new NotFoundErr("user not found");
  if (!post) throw new NotFoundErr("post not found");
  req.data.fetchedUser = user;
  req.data.fetchedPost = post;

  next();
}

