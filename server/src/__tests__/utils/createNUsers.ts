import User, { IUser } from "../../models/User";
import getUserDataForModel from "./getUserDataForModel";

export default async function createNUsers(
  amount: number,
  customModelData: Partial<IUser> = {}
) {
  const promises = [];
  for (let i = 0; i < amount; i++) {
    promises.push(User.create({ ...getUserDataForModel(), ...customModelData }));
  }

  return Promise.all(promises);
}