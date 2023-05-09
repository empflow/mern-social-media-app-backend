import { HydratedDocument } from "mongoose";
import { IUser } from "../../models/User";


export default function expectPostIsOnCreatorsWall(body: any, user: HydratedDocument<IUser>) {
  expect(body.onUser).toBe(user.id);
  expect(body.createdBy).toBe(user.id);
}
