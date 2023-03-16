import { Request, Response } from "express";
import User from "../models/User";

export async function signUp(req: Request, res: Response) {
  const user = await User.create(req.body);
  res.status(201).json(user);
}

export async function signIn(req: Request, res: Response) {
  const user = (req as any).user;
  const token = await user.createJwt();
  res.status(200).json({ token });
}