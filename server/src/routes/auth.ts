import express from "express";
const router = express.Router();
import { signUp, signIn } from "../controllers/auth";
import { validateSignInCredentials } from "../middleware/validateSignInCredentials";
import multer from "multer";
import multerOptions from "../config/multer";
const upload = multer(multerOptions);

router.post("/sign-up", upload.single("avatar"), signUp);
router.post("/sign-in", validateSignInCredentials, signIn);

export default router;
