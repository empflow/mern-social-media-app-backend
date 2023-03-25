import express from "express";
import { addFriend, deleteAccount, deleteFriend, patchAccount } from "../controllers/account";
import getOwnAccount from "../middleware/getOwnAccount";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.route("/friends/:friendProfilePath")
  .delete(deleteFriend);

router.route("/friends")
  .post(getOwnAccount, addFriend);


export default router;