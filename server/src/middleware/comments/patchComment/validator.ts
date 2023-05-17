import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { getFileCountExceedsLimitMsg } from "../../../config/multer";
import Comment, { IComment } from "../../../models/Comment";
import doesArrHaveStrDuplicates from "../../../utils/doesArrHaveStrDuplicates";
import { BadRequestErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import { imgsUploadLimit } from "../../../utils/s3";


export default async function patchCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundErr("comment not found");

  checkFilesCountExceedLimit(req, comment);
  next();
}


function checkFilesCountExceedLimit(req: IReq, comment: HydratedDocument<IComment>) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || !files.length) return; // impossible to exceed the limit if no new files are provided

  const totalFileCount = getTotalFileCount(req, comment, files);
  throwIfTotalFileCountOverLimit(totalFileCount, imgsUploadLimit);
}


function getTotalFileCount(req: IReq, comment: HydratedDocument<IComment>, files: Express.Multer.File[]) {
  const { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;
  validateFilesToDeleteIds(comment, filesToDeleteIds);

  const filesToDeleteIdsLen = getFilesToDeleteIdsLen(filesToDeleteIds);
  const newFilesLen = files.length ?? 0;
  const existingImgsLen = comment.imgs.length;

  return newFilesLen + existingImgsLen - filesToDeleteIdsLen;
}


function validateFilesToDeleteIds(
  comment: HydratedDocument<IComment>, filesToDeleteIds: string | string[] | undefined
) {
  if (typeof filesToDeleteIds === "string") {
    filesToDeleteIds = [filesToDeleteIds];
  } else if (!filesToDeleteIds) return;

  if (doesArrHaveStrDuplicates(filesToDeleteIds)) {
    throw new BadRequestErr(`array of ids of files to delete contains duplicates`);
  }

  const existingImgsIds = comment.imgs.map(imgObj => (imgObj as any).id);
  console.log(existingImgsIds);
  filesToDeleteIds.forEach(id => {
    if (!existingImgsIds.includes(id)) {
      throw new BadRequestErr(`${id} does not match any files`);
    }
  });
}


function getFilesToDeleteIdsLen(filesToDeleteIds: string | string[] | undefined) {
  let filesToDeleteIdsLen: number;

  if (Array.isArray(filesToDeleteIds)) {
    filesToDeleteIdsLen = filesToDeleteIds.length;
  } else if (typeof filesToDeleteIds === "string") {
    filesToDeleteIdsLen = 1;
  } else filesToDeleteIdsLen = 0;

  return filesToDeleteIdsLen;
}


function throwIfTotalFileCountOverLimit(totalFileCount: number, limit: number) {
  if (totalFileCount > limit) {
    const msg = getFileCountExceedsLimitMsg(imgsUploadLimit);
    throw new BadRequestErr(msg);
  }
}
