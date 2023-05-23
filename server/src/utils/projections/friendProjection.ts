import { IUser } from "../../models/User";


const friendProjection: Partial<Record<keyof IUser, number>> = {
  firstName: 1,
  lastName: 1,
  avatarUrl200px: 1,
  avatarUrl100px: 1,
  profilePath: 1
}


export default friendProjection;
