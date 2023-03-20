import { TErr } from "../middleware/errHandler";
import { MongoError } from "mongodb";

export default function isErrCausedByUser(err: TErr) {
  if (
    err instanceof MongoError ||
    err.name === "ValidationError" ||
    err.name === "CastError"
  ) {
    return true;
  }
  return false;
}