import { getFileCountExceedsLimitMsg } from "../config/multer";
import { convertFilesToDeleteIdsToArr } from "../middleware/comments/patchComment/validator";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import doesArrHaveDuplicates from "./doesArrHaveDuplicates";
import { BadRequestErr } from "./errs";
import { IReq } from "./reqResInterfaces";
import { imgsUploadLimit } from "./s3";


type TDoc = IComment | IPost;

export default function validateFileCount(req: IReq, doc: TDoc) {
  const { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  validateFilesToDeleteIds(doc, filesToDeleteIds);

  if (!files || !files.length) return; // impossible to exceed the limit if no new files are provided
  const totalFileCount = getTotalFileCount(req, doc, files);
  throwIfTotalFileCountOverLimit(totalFileCount, imgsUploadLimit);
}


function validateFilesToDeleteIds(
  comment: TDoc, filesToDeleteIds: string | string[] | undefined
) {
  if (typeof filesToDeleteIds === "string") {
    filesToDeleteIds = [filesToDeleteIds];
  } else if (!filesToDeleteIds) return;

  if (doesArrHaveDuplicates(filesToDeleteIds)) {
    throw new BadRequestErr(`array of ids of files to delete contains duplicates`);
  }

  const existingImgsIds = comment.imgs.map(imgObj => imgObj._id.toString());
  filesToDeleteIds.forEach(id => {
    if (!existingImgsIds.includes(id)) {
      throw new BadRequestErr(`${id} does not match any files`);
    }
  });
}


function getTotalFileCount(req: IReq, comment: TDoc, files: Express.Multer.File[]) {
  const { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;

  const filesToDeleteIdsLen = getFilesToDeleteIdsLen(filesToDeleteIds);
  const newFilesLen = files.length ?? 0;
  const existingImgsLen = comment.imgs.length;

  return newFilesLen + existingImgsLen - filesToDeleteIdsLen;
}


function getFilesToDeleteIdsLen(filesToDeleteIds: string | string[] | undefined) {
  const filesToDeleteIdsLen = convertFilesToDeleteIdsToArr(
    filesToDeleteIds
  ).length;

  return filesToDeleteIdsLen;
}


function throwIfTotalFileCountOverLimit(totalFileCount: number, limit: number) {
  if (totalFileCount > limit) {
    const msg = getFileCountExceedsLimitMsg(imgsUploadLimit);
    throw new BadRequestErr(msg);
  }
}

