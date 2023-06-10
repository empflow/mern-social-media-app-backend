import { getFileCountExceedsLimitMsg } from "../config/multer";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import doesArrHaveDuplicates from "./doesArrHaveDuplicates";
import { BadRequestErr } from "./errs";
import { IReq } from "./reqResInterfaces";
import { imgsAmountUploadLimit } from "../config/global";
import convertFilesToDeleteIdsToArr from "./convertFilesToDeleteIdsToArr";


type TDocWithMedia = IComment | IPost;

export default function validateFileCount(req: IReq, docWithMedia: TDocWithMedia) {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || !files.length) return; // impossible to exceed the limit if no new files are provided
  const totalFileCount = getTotalFileCount(req, docWithMedia, files);
  throwIfNeeded(totalFileCount, imgsAmountUploadLimit);
}


function getTotalFileCount(req: IReq, comment: TDocWithMedia, files: Express.Multer.File[]) {
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


function throwIfNeeded(totalFileCount: number, limit: number) {
  if (totalFileCount > limit) {
    const msg = getFileCountExceedsLimitMsg(imgsAmountUploadLimit);
    throw new BadRequestErr(msg);
  }
}

