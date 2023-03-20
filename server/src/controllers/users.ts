import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import { IReq, IRes } from "../utils/ReqResInterfaces";

export async function getUsers(req: IReq, res: IRes) {
  const users = await User.find({});
  res.status(200).json(users);
}

export async function getUser(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const user = await User.findOne({ profilePath });
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}
