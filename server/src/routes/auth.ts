import express from "express";
const router = express.Router();
import { upload } from "..";

import { signUp, signIn } from "../controllers/auth";
import { validateSignInCredentials } from "../middleware/validateSignInCredentials";

router.post("/sign-up", upload.single("picture"), signUp);
router.post("/sign-in", validateSignInCredentials, signIn);

export default router;