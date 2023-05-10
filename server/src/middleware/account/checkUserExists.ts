import { NextFunction } from "express";
import User from "../../models/User";
import { NotFoundErr } from "../../utils/errs";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function checkUserExists(req: IReq, res: IRes, next: NextFunction) {
  const id = req.data.user.userId;

  const user = await User.findById(id);
  if (!user) throw new NotFoundErr("user not found");

  next();
}