import express from "express";
import { acceptFriendRequest, deleteAccount, deleteFriend, patchAccount, sendFriendRequest } from "../controllers/account";
import validateAcceptingFriendRequest from "../middleware/validateAcceptingFriendRequest";
import { validateSendingFriendRequest } from "../middleware/validateSendingFriendRequest";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.route("/friends/:friendProfilePath")
  .delete(deleteFriend);

router.post(
  "/friends/sendFriendRequest/:friendId",
  validateSendingFriendRequest,
  sendFriendRequest
);

router.post(
  "/friends/acceptFriendRequest/:friendId",
  validateAcceptingFriendRequest,
  acceptFriendRequest
);


export default router;