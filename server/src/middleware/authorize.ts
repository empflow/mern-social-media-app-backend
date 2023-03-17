import { NextFunction, Request, Response } from "express";
import { UnauthorizedErr } from "../utils/errs";
import jwt from "jsonwebtoken";

export default function authorize(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedErr("invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    throw new UnauthorizedErr("invalid jwt signature");
  }
  next();
}