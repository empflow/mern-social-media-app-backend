import express from "express";
import { addFriend, deleteAccount, patchAccount } from "../controllers/account";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

router.route("/friends")
  .post(addFriend);

export default router;