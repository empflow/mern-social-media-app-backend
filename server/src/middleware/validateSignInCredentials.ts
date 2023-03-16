import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { BadRequestErr, NotFoundErr, UnauthorizedErr } from "../utils/errs";

export async function validateSignInCredentials(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErr("Both email and password must be provided");
  }

  const user: any = await User.findOne({ email });
  if (!user) throw new NotFoundErr("User not found");

  const doPasswordsMatch = await user.comparePasswords(password);
  if (!doPasswordsMatch) {
    throw new UnauthorizedErr("Wrong password");
  }

  (req as any).user = user;
  next();
}