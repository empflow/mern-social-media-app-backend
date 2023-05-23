import { NextFunction } from "express";
import User from "../../models/User";
import { ConflictErr } from "../../utils/errs";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function checkProfilePathAvailable(req: IReq, res: IRes, next: NextFunction) {
  const { profilePath } = req.body;

  if (profilePath) {
    const userExists = !!(await User.findOne({ profilePath }));
    if (userExists) throw new ConflictErr("profile path unavailable");
  }

  next();
}