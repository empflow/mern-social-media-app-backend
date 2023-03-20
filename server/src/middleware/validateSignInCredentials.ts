import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { BadRequestErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function validateSignInCredentials(req: IReq, res: IRes, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErr("both email and password must be provided");
  }

  const user: any = await User.findOne({ email });
  if (!user) throw new NotFoundErr("user not found");

  const doPasswordsMatch = await user.comparePasswords(password);
  if (!doPasswordsMatch) {
    throw new UnauthorizedErr("wrong password");
  }

  req.data.user = user;
  next();
}