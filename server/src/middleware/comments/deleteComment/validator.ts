import { NextFunction } from "express";
import checkObjectIdValid from "../../../utils/checkObjectIdValid";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function deleteCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { commentId } = req.params;
  checkObjectIdValid(commentId);
  next();
}
