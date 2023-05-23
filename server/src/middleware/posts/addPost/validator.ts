import { NextFunction, Request } from "express";
import User, { IUser } from "../../../models/User";
import { BadRequestErr, ForbiddenErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default async function addPostValidator(req: IReq, res: IRes, next: NextFunction) {
  checkIfAnyContentIsProvided(req);
  const userToPostTo = await checkAndGetUserToPostTo(req);
  await checkIfAllowedToPost(req, userToPostTo);
  await checkAndGetPoster(req);
  req.data.userToPostTo = userToPostTo;
  next();
}


function checkIfAnyContentIsProvided(req: IReq) {
  if (!req.body.content && !req.file && !req.files) {
    throw new BadRequestErr("no content was provided");
  }
}


async function checkAndGetUserToPostTo(req: Request) {
  const { profilePath } = req.params;
  const userToPostTo = await User.findOne({ profilePath });
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  return userToPostTo;
}


async function checkIfAllowedToPost(req: IReq, userToPostTo: IUser) {
  const { userId: posterId } = req.data.user;
  const userToPostToId = userToPostTo.id;

  if (!userToPostTo.canAnyonePost && posterId !== userToPostToId) {
    throw new ForbiddenErr("posting to this user's wall is not allowed");
  }
}


async function checkAndGetPoster(req: IReq) {
  const { userId: createdBy } = req.data.user;
  const poster = await User.findById(createdBy);
  if (!poster) throw new NotFoundErr("poster not found");
  return poster;
}
