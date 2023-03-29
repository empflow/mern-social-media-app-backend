import express from "express";
import { acceptFriendRequest, deleteAccount, deleteFriend, patchAccount, rejectFriendRequest, sendFriendRequest } from "../controllers/account";
import validateAcceptingFriendRequest from "../middleware/validateAcceptingFriendRequest";
import validateRejectingFriendRequest from "../middleware/validateRejectingFriendRequest";
import { validateSendingFriendRequest } from "../middleware/validateSendingFriendRequest";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.route("/friends/:friendId")
  .delete(deleteFriend);

router.post(
  "/friends/sendRequest/:friendId",
  validateSendingFriendRequest,
  sendFriendRequest
);

router.post(
  "/friends/acceptRequest/:friendId",
  validateAcceptingFriendRequest,
  acceptFriendRequest
);

router.post(
  "/friends/rejectRequest/:friendId",
  validateRejectingFriendRequest,
  rejectFriendRequest
)


export default router;