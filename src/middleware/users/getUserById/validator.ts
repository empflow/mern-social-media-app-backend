import { NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import validateObjectId from "../../../utils/validateObjectId";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";

export default function getUserByIdValidator(req: IReq, res: IRes, next: NextFunction) {
  const { userId } = req.params;
  validateObjectId(userId);
  next();
}