import { NextFunction } from "express";
import User from "../models/User";
import { BadRequestErr } from "../utils/errs";
import { IReq, IRes } from "../utils/reqResInterfaces";
import givenNImgsAndTextContent from "../__tests__/test_posts/givenNImgsAndTextContent/givenNImgsAndTextContent";

export default async function checkProfilePathAvailable(req: IReq, res: IRes, next: NextFunction) {
  const { profilePath } = req.body;

  if (profilePath) {
    const userExists = !!(await User.findOne({ profilePath }));
    if (userExists) throw new BadRequestErr("profile path unavailable");
  }

  next();
}