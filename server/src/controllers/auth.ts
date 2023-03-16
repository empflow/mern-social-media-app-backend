import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { InternalServerErr, NotFoundErr, UnauthorizedErr, BadRequestErr } from "../utils/errs";

export async function signUp(req: Request, res: Response) {
  const user = await User.create(req.body);
  res.status(201).json(user);
}

export async function signIn(req: Request, res: Response) {
  const user = (req as any).user;
  const token = await user.createJwt();
  res.status(200).json({ token });
}