import { Request, Response } from "express";
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

export async function deleteUser(req: Request, res: Response) {
  const { profileId: profileIdToDelete } = req.params;

  const userToDelete = await User.findOne({ profileId: profileIdToDelete });
  if (!userToDelete) throw new NotFoundErr("user not found");
  const deleterId = (req as any).user.userId;

  if (userToDelete._id.toString() !== deleterId) {
    throw new ForbiddenErr("you can only delete your own account");
  }

  await User.deleteOne({ profileId: profileIdToDelete });
  res.status(200).json({ message: "user deleted" });
}
