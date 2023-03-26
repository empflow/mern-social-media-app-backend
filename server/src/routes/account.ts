import express from "express";
import { deleteAccount, deleteFriend, patchAccount, sendFriendRequest } from "../controllers/account";
import getOwnAccount from "../middleware/getOwnAccount";
import { validateSendingFriendReq } from "../middleware/validateSendingFriendReq";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.route("/friends/:friendProfilePath")
  .delete(deleteFriend);

router.post(
  "/friends/sendFriendRequest/:friendId",
  validateSendingFriendReq,
  sendFriendRequest
);
router.post("/friends/acceptFriendRequest/:friendId");


export default router;