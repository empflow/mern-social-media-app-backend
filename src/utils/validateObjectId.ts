import { isValidObjectId } from "mongoose";
import { BadRequestErr } from "./errs";


export default function validateObjectId(id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestErr("invalid id");
  }
}
