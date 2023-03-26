import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import friendDocProjection from "../utils/projections/friendDocProjection";
import userDocProjection from "../utils/projections/userDocProjection";
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

export async function getUserById(req: IReq, res: IRes) {
  const { userId } = req.params;
  const user = await User.findById(userId, userDocProjection);
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}

export async function getUserFriends(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const user = await User.findOne({ profilePath }, { friends: 1 });
  if (!user) throw new NotFoundErr("user not found");
  const friendsIds = user.friends;
  const friendsDocs = await User.find(
    { _id: { $in: friendsIds } }, friendDocProjection
  );
  res.status(200).json(friendsDocs);
}
