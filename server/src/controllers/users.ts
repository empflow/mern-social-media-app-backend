import User from "../models/User";
import { NotFoundErr } from "../utils/errs";
import friendProjection from "../utils/projections/friendProjection";
import userProjection from "../utils/projections/userProjection";
import { IReq, IRes } from "../utils/reqResInterfaces";


export async function getUsers(req: IReq, res: IRes) {
  const users = await User.find({}, userProjection);
  res.status(200).json(users);
}


export async function getUser(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const user = await User.findOne({ profilePath }, userProjection);
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}


export async function getUserById(req: IReq, res: IRes) {
  const { userId } = req.params;
  const user = await User.findById(userId, userProjection);
  if (!user) throw new NotFoundErr("user not found");
  res.status(200).json(user);
}


export async function getUserFriends(req: IReq, res: IRes) {
  const { profilePath } = req.params;
  const user = await User.findOne({ profilePath }, { friends: 1 });
  if (!user) throw new NotFoundErr("user not found");
  const friendsIds = user.friends;
  const friendsDocs = await User.find(
    { _id: { $in: friendsIds } }, friendProjection
  );
  res.status(200).json(friendsDocs);
}
