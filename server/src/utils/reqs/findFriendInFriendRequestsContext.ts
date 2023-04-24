import User from "../../models/User";
import { findDocsByIds } from "../findDocs";
import userProjection from "../projections/userProjection";

export default async function findFriendInFriendRequestsContext(senderId: string, receiverId: string) {
  const [sender, receiver] = await findDocsByIds(
    User,
    [senderId, receiverId],
    { ...userProjection, friends: 1, friendRequestsSent: 1, friendRequestsReceived: 1 }
  );

  return [sender, receiver];
}