import { NextFunction } from "express";
import validateObjectId from "../../../utils/validateObjectId";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function deleteFriendValidator(req: IReq, res: IRes, next: NextFunction) {
  const { friendId } = req.params;
  const accountToDeleteFromId: string = req.data.user.userId;

  validateObjectId(friendId);
  validateObjectId(accountToDeleteFromId);
  next();
}
