import { NextFunction } from "express";
import { UnauthorizedErr } from "../utils/errs";
import jwt from "jsonwebtoken";
import { IReq, IRes } from "../utils/reqResInterfaces";
import getEnvVar from "../utils/getEnvVar";


export default function authorize(req: IReq, res: IRes, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedErr("unauthorized");
  }

  const token = authHeader.split(" ")[1];
  
  const JWT_SECRET = getEnvVar("JWT_SECRET");
  try {
    req.data.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedErr("jwt verification failed");
  }
  next();
}