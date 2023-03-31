import { getRandomProfilePath } from "../utils/pathsGenerators";
import User from "../models/User";
import { IReq, IRes } from "../utils/reqResInterfaces";
import { BadRequestErr } from "../utils/errs";

export async function signUp(req: IReq, res: IRes) {
  const { password } = req.body;
  if (password.length < 10) {
    throw new BadRequestErr("password must be at least 10 characters long");
  }
  
  const profilePath = getRandomProfilePath();
  const user = await User.create({ ...req.body, profilePath });
  const token = await (user as any).createJwt();
  res.status(201).json({ user, token });
}

export async function signIn(req: IReq, res: IRes) {
  const user = req.data.user;
  const token = await user.createJwt();
  res.status(200).json({
    token,
    user: {
      _id: user._id,
      profilePath: user.profilePath
    }
  });
}