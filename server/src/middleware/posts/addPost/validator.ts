import { NextFunction, Request } from "express";
import { imgSizeLimitInMb } from "../../../config/global";
import User, { IUser } from "../../../models/User";
import { BadRequestErr, ForbiddenErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import throwIfFileExceedsSizeLimit from "../../../utils/throwIfFileExceedsSizeLimit";


export default async function addPostValidator(req: IReq, res: IRes, next: NextFunction) {
  throwIfNoContentProvided(req);
  const buffers = (req.files as Express.Multer.File[]).map(file => file.buffer);
  throwIfFileExceedsSizeLimit(buffers, imgSizeLimitInMb);

  const [userToPostTo] = await Promise.all([
    getAndCheckUserToPostTo(req),
    checkAndGetPoster(req)
  ]);
  
  checkIfAllowedToPost(req, userToPostTo);

  req.data.userToPostTo = userToPostTo;
  next();
}


function throwIfNoContentProvided(req: IReq) {
  if (!req.body.content && !req.file && !req.files) {
    throw new BadRequestErr("no content provided");
  }
}


async function getAndCheckUserToPostTo(req: Request) {
  const { profilePath } = req.params;
  const userToPostTo = await User.findOne({ profilePath });
  if (!userToPostTo) throw new NotFoundErr("user to post to not found");
  return userToPostTo;
}


function checkIfAllowedToPost(req: IReq, userToPostTo: IUser) {
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
