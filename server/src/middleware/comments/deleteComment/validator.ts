import { NextFunction } from "express";
import validateObjectId from "../../../utils/validateObjectId";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function deleteCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { commentId } = req.params;
  validateObjectId(commentId);
  next();
}
