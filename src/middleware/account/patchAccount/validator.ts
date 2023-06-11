import { NextFunction } from "express";
import User, { IUser } from "../../../models/User";
import { BadRequestErr, ConflictErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export const changeableFields: Partial<keyof IUser>[] = ["firstName", "lastName", "email", "profilePath", "birthday", "city", "occupation", "status", "canAnyonePost"];

export default async function patchAccountValidator(req: IReq, res: IRes, next: NextFunction) {
  await Promise.all([
    throwIfNoDataProvided(req),
    throwIfProfilePathUnavailable(req),
    throwIfUserNotFound(req)]
  )
  next();
}


function throwIfNoDataProvided(req: IReq) {
  for (const key in req.body) {
    const isFieldChangeable = changeableFields.includes(key as any);
    if (!isFieldChangeable) {
      throw new BadRequestErr(`'${key}' either does not exist or it is forbidden to update it`);
    }
  }

  const isMediaProvided = !!(req.file || req.files);
  if (isMediaProvided) return;

  const isTextDataProvided = !!(Object.values(req.body).length);
  if (!isTextDataProvided) throw new BadRequestErr("no new data provided");
}


async function throwIfProfilePathUnavailable(req: IReq) {
  const { profilePath } = req.body;

  if (profilePath) {
    const userExists = !!(await User.findOne({ profilePath }, { _id: 1 }));
    if (userExists) throw new ConflictErr("profile path unavailable");
  }
}


async function throwIfUserNotFound(req: IReq) {
  const { userId } = req.data.user;
  const user = await User.findById(userId);
  if (!user) throw new NotFoundErr("user not found");
}
