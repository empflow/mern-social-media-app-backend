import express from "express";
const router = express.Router();
import { signUp, signIn } from "../controllers/auth";
import { validateSignInCredentials } from "../middleware/validateSignInCredentials";
import multer from "multer";
import multerDiskStorageConf from "../config/multer";
const storage = multer.diskStorage(multerDiskStorageConf);
const upload = multer({ storage });

router.post("/sign-up", upload.single("image"), signUp);
router.post("/sign-in", validateSignInCredentials, signIn);

export default router;