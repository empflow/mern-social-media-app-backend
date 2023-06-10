import express from "express";
import { acceptFriendRequest, deleteAccount, deleteFriend, getOwnAccount, patchAccount, rejectFriendRequest, sendFriendRequest } from "../controllers/account";
import validateAcceptingFriendRequest from "../middleware/account/validateAcceptingFriendRequest";
import validateRejectingFriendRequest from "../middleware/account/validateRejectingFriendRequest";
import { validateSendingFriendRequest } from "../middleware/account/validateSendingFriendRequest";
const router = express.Router();
import { upload } from "../config/multer";
import uploadAvatarIfPresent from "../middleware/account/uploadAvatarIfPresent";
import deleteFriendValidator from "../middleware/account/deleteFriend/validator";
import patchAccountValidator from "../middleware/account/patchAccount/validator";


router.get("/", getOwnAccount);
router.patch(
  "/",
  upload.single("avatar"),
  patchAccountValidator,
  uploadAvatarIfPresent,
  patchAccount
);
router.delete("/", deleteAccount);

router.route("/friends/:friendId")
  .delete(
    deleteFriendValidator,
    deleteFriend
  );

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
