import { isValidObjectId } from "mongoose";
import { TDocWithMedia } from "../config/global";
import doesArrHaveDuplicates from "./doesArrHaveDuplicates";
import { BadRequestErr } from "./errs";
import { IReq } from "./reqResInterfaces";


export default function validateFilesToDeleteIds(req: IReq, doc: TDocWithMedia) {
  let { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;

  if (typeof filesToDeleteIds === "string") {
    filesToDeleteIds = [filesToDeleteIds];
  } else if (!filesToDeleteIds) return;

  throwIfArrContainsDuplicatesOrInvalidIds(filesToDeleteIds);
  throwIfSomeIdsToDeleteDontMatchExistingImgIds(filesToDeleteIds, doc);
}


function throwIfSomeIdsToDeleteDontMatchExistingImgIds(filesToDeleteIds: string[], doc: TDocWithMedia) {
  const existingImgsIds = doc.imgs.map(imgObj => imgObj._id.toString());
  filesToDeleteIds.forEach(id => {
    if (!existingImgsIds.includes(id)) {
      throw new BadRequestErr(`${id} does not match any files`);
    }
  });
}


function throwIfArrContainsDuplicatesOrInvalidIds(filesToDeleteIds: string[]) {
  filesToDeleteIds.forEach(fileId => {
    if (!isValidObjectId(fileId)) throw new BadRequestErr(`${fileId} is invalid`)
  });

  if (doesArrHaveDuplicates(filesToDeleteIds)) {
    throw new BadRequestErr(`array of ids of files to delete contains duplicates`);
  }
}
