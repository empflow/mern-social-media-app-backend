import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";

export default async function validateUserPatchRequest(
  req: Request, res: Response, next: NextFunction
) {
  const { profileId: userToPatchProfileId } = req.params;
  const userToPatch = await User.findOne({ profileId: userToPatchProfileId });
  const requesterId = (req as any).user.userId;

  if (!userToPatch) throw new NotFoundErr("user not found");
  
  const userToPatchId = userToPatch._id.toString();
  if (userToPatchId !== requesterId) {
    const errMsg = "you can only make changes to your own account";
    throw new ForbiddenErr(errMsg);
  }

  if (req.body.profileId) {
    if (await User.findOne({ profileId: req.body.profileId })) {
      const errMsg = "another user already has this profile id";
      throw new ForbiddenErr(errMsg);
    }
  }

  next();
}