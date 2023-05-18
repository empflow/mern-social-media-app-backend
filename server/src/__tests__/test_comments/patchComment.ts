import { HydratedDocument } from "mongoose";
import { IComment } from "../../models/Comment";

export default async function patchComment(
  data: {
    content?: string,
    replyTo?: string,
    commentToPatch: HydratedDocument<IComment>,
    imgsToDeleteIds?: string[],
    newImgs?: { path: string, amount: number }
  }
) {

}