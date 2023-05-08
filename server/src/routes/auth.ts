import express from "express";
const router = express.Router();
import { signUp, signIn } from "../controllers/auth";
import { validateSignInCredentials } from "../middleware/validateSignInCredentials";
import { upload } from "../config/multer";


router.post("/sign-up", upload.single("avatar"), signUp);
router.post("/sign-in", validateSignInCredentials, signIn);

export default router;
