import { TErr } from "../middleware/errHandler";
import { MongoError, MongoServerError } from "mongodb";

export default function isErrCausedByUser(err: TErr) {
  if (
    err instanceof MongoError ||
    err instanceof MongoServerError ||
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.name === "MongoServerError"
  ) {
    return true;
  }
  return false;
}