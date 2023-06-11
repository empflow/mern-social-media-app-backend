import { NextFunction } from "express";
import { BadRequestErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


export default function getFeedValidator(req: IReq, res: IRes, next: NextFunction) {
  const { page } = req.body;
  if (!page) throw new BadRequestErr("feed page not specified");
  next();
}
