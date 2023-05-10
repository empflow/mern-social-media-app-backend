import { HydratedDocument } from "mongoose";
import { IUser } from "../../models/User";
import getAuthHeader from "./getAuthHeader";

export default function getAuthHeadersForUsers(...users: HydratedDocument<IUser>[]) {
  return users.map(user => getAuthHeader(user.id));
}