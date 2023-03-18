import { NextFunction, request, Request, Response } from "express";
import User from "../models/User";
import { ForbiddenErr, NotFoundErr } from "../utils/errs";

export async function getUsers(req: Request, res: Response) {
  const users = await User.find({});
  res.status(200).json(users);
}

export async function getUser(req: Request, res: Response) {
  const { profileId } = req.params;
  const user = await User.findOne({ profileId });
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}
