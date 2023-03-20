import express from "express";
import { getUserById, getUserFriends } from "../controllers/users";
import { getUser, getUsers } from "../controllers/users";
const router = express.Router();

router.get("/", getUsers);
router.get("/:profilePath", getUser);
router.get("/id/:userId", getUserById);
router.get("/:profilePath/friends", getUserFriends)

export default router;