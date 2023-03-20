import express from "express";
import { addFriend, deleteAccount, deleteFriend, patchAccount } from "../controllers/account";
import getOwnAccount from "../middleware/getOwnAccount";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.use(getOwnAccount);

router.route("/friends")
  .post(addFriend);

router.route("/friends/:friendId")
  .delete(deleteFriend);

export default router;