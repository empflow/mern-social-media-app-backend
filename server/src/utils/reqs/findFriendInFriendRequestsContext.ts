import User from "../../models/User";
import { findDocsByIds } from "../findDocs";
import friendReqUserProjection from "../projections/friendReqUserProjection";
import userProjection from "../projections/userProjection";


export default async function findFriendReqSenderAndReceiver(senderId: string, receiverId: string) {
  const [sender, receiver] = await findDocsByIds(
    User,
    [senderId, receiverId],
    friendReqUserProjection
  );

  return [sender, receiver];
}
