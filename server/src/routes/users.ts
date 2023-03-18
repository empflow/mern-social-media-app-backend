import express from "express";
import { deleteUser, getUser, getUsers, patchUser } from "../controllers/users";
import authorize from "../middleware/authorize";
import validateUserPatchRequest from "../middleware/validateUserPatchRequest";
const router = express.Router();

router.use(authorize);

router.route("/")
  .get(getUsers);

router.route("/:profileId")
  .get(getUser)
  .delete(deleteUser)
  .patch(validateUserPatchRequest, patchUser);

export default router;