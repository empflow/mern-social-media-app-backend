import express from "express";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();

router.get("/", getUsers);
router.get("/:profileId", getUser);

export default router;