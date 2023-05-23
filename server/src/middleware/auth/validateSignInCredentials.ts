import { NextFunction } from "express";
import User from "../../models/User";
import { BadRequestErr, NotFoundErr, UnauthorizedErr } from "../../utils/errs";
import { IReq, IRes } from "../../utils/reqResInterfaces";


export async function validateSignInCredentials(req: IReq, res: IRes, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErr("both email and password must be provided");
  }

  const user = await User.findOne({ email }, { _id: 1, profilePath: 1, password: 1 });
  if (!user) throw new NotFoundErr("user not found");

  const doPasswordsMatch = await (user as any).comparePasswords(password);
  if (!doPasswordsMatch) {
    throw new UnauthorizedErr("wrong password");
  }

  req.data.user = user;
  next();
}
