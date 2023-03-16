import express from "express";
const router = express.Router();

import { signUp, signIn } from "../controllers/auth";
import { validateSignInCredentials } from "../middleware/validateSignInCredentials";

router.post("/sign-up", signUp);
router.post("/sign-in", validateSignInCredentials, signIn);

export default router;