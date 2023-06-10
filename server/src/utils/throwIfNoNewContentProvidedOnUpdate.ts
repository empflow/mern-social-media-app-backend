import { BadRequestErr } from "./errs";
import { IReq } from "./reqResInterfaces";


export default function throwIfNoNewContentProvidedOnUpdate(req: IReq) {
  const errMsg = "no content provided";
  const { filesToDeleteIds, content } = req.body;

  const noFiles = !req.files?.length;
  if (noFiles && !filesToDeleteIds) {
    if (typeof content === "string" && !content.trim()) {
      throw new BadRequestErr(errMsg);
    } else if (content === undefined) {
      throw new BadRequestErr(errMsg);
    }
  }
}
