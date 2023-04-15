import { NextFunction } from "express";
import { UnauthorizedErr } from "../utils/errs";
import jwt from "jsonwebtoken";
import { IReq, IRes } from "../utils/reqResInterfaces";

export default function authorize(req: IReq, res: IRes, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedErr("unauthorized");
  }

  const token = authHeader.split(" ")[1];
  
  try {
    req.data.user = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    throw new UnauthorizedErr("jwt verification failed");
  }
  next();
}