import express from "express";
import { deleteAccount, patchAccount } from "../controllers/account";
const router = express.Router();

router.patch("/", patchAccount);
router.delete("/", deleteAccount);

export default router;