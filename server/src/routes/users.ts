import express from "express";
import { getUser, getUsers } from "../controllers/users";
import authorize from "../middleware/authorize";
import validateUserPatchRequest from "../middleware/validateUserPatchRequest";
const router = express.Router();

router.get("/", getUsers);
router.get("/:profileId", getUser);

export default router;