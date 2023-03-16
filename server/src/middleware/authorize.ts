import { NextFunction, Request, Response } from "express";

export default function authorize(req: Request, res: Response, next: NextFunction) {
  console.log("This is authorization middleware speaking!");
  console.log(req.headers.authorization);
  next();
}