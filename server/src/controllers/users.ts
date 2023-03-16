import { Request, Response } from "express";
import User from "../models/User";

export async function getUsers(req: Request, res: Response) {
  const users = await User.find({});
  res.status(200).json(users);
}