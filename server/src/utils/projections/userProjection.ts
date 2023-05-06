import { IUser } from "../../models/User";

const userProjection: Partial<Record<keyof IUser, number>> = {
  firstName: 1,
  lastName: 1,
  avatarUrl400px: 1,
  avatarUrl200px: 1,
  avatarUrl100px: 1,
  profilePath: 1,
  friends: 1,
  occupation: 1,
  birthday: 1,
  canAnyonePost: 1,
  city: 1,
  status: 1,
  createdAt: 1,
}

export default userProjection;
