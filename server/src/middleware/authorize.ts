import { NextFunction } from "express";
import { BadRequestErr, UnauthorizedErr } from "../utils/errs";
import jwt from "jsonwebtoken";
import { IReq, IRes } from "../utils/reqResInterfaces";
import getEnvVar from "../utils/getEnvVar";
import validateObjectId from "../utils/validateObjectId";


export default function authorize(req: IReq, res: IRes, next: NextFunction) {
  const token = validateAndGetToken(req);
  const payload = validateAndGetPayload(token);
  req.data.user = payload;
  next();
}


function validateAndGetToken(req: IReq) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedErr("unauthorized");
  }
  return authHeader.split(" ")[1];
}


function validateAndGetPayload(token: string) {
  const JWT_SECRET = getEnvVar("JWT_SECRET");
  let payload: jwt.JwtPayload | string;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedErr("jwt verification failed");
  }

  validateJwtPayload(payload);
  return payload;
}


function validateJwtPayload(payload: jwt.JwtPayload | string) {
  if (typeof payload === "string") throw new BadRequestErr("invalid token");
  validateObjectId(payload.userId);
}
