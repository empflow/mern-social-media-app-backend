import { NextFunction } from "express";
import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/reqResInterfaces";

export default async function getOwnAccount(req: IReq, res: IRes, next: NextFunction) {
  const account = await User.findById(req.data.user.userId);
  if (!account) throw new NotFoundErr("account not found");
  req.data.account = account;
  next();
}