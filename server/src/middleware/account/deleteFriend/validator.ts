import { NextFunction } from "express";
import checkObjectIdValid from "../../../utils/checkObjectIdValid";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function deleteFriendValidator(req: IReq, res: IRes, next: NextFunction) {
  const { friendId } = req.params;
  const accountToDeleteFromId: string = req.data.user.userId;

  checkObjectIdValid(friendId);
  checkObjectIdValid(accountToDeleteFromId);
  next();
}
