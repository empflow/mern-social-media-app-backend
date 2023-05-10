import { NextFunction } from "express";
import { IReq, IRes } from "../../utils/reqResInterfaces";

export default async function uploadAvatarIfPresent(req: IReq, res: IRes, next: NextFunction) {
  if (req.file) {
    console.log(req.file);
  }

  next();
}