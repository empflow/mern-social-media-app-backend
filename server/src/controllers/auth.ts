import { Request, Response } from "express";
import getRandomUserId from "../utils/getRandomUserId";
import User from "../models/User";

export async function signUp(req: Request, res: Response) {
  const idLength = 9;
  const profileId = `user${getRandomUserId(idLength)}`;
  const user = await User.create({ ...req.body, profileId });
  const token = await (user as any).createJwt();
  res.status(201).json({ user, token });
}

export async function signIn(req: Request, res: Response) {
  const user = (req as any).user;
  const token = await user.createJwt();
  res.status(200).json({ token });
}