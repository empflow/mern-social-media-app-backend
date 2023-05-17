import { NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { getFileCountExceedsLimitMsg } from "../../../config/multer";
import Comment, { IComment } from "../../../models/Comment";
import deepCopy from "../../../utils/deepCopy";
import doesArrHaveDuplicates from "../../../utils/doesArrHaveDuplicates";
import { BadRequestErr, NotFoundErr } from "../../../utils/errs";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import { imgsUploadLimit } from "../../../utils/s3";


export default async function patchCommentValidator(req: IReq, res: IRes, next: NextFunction) {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) throw new NotFoundErr("comment not found");

  checkFilesCountExceedLimit(req, comment);

  req.data.comment = deepCopy(comment);
  next();
}


function checkFilesCountExceedLimit(req: IReq, comment: HydratedDocument<IComment>) {
  const { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;
  const files = req.files as Express.Multer.File[] | undefined;
  validateFilesToDeleteIds(comment, filesToDeleteIds);

  if (!files || !files.length) return; // impossible to exceed the limit if no new files are provided
  const totalFileCount = getTotalFileCount(req, comment, files);
  throwIfTotalFileCountOverLimit(totalFileCount, imgsUploadLimit);
}


function getTotalFileCount(req: IReq, comment: HydratedDocument<IComment>, files: Express.Multer.File[]) {
  const { filesToDeleteIds }: { filesToDeleteIds: string | string[] | undefined } = req.body;

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

  if (doesArrHaveDuplicates(filesToDeleteIds)) {
    throw new BadRequestErr(`array of ids of files to delete contains duplicates`);
  }

  const existingImgsIds = comment.imgs.map(imgObj => (imgObj as any).id);
  filesToDeleteIds.forEach(id => {
    if (!existingImgsIds.includes(id)) {
      throw new BadRequestErr(`${id} does not match any files`);
    }
  });
}


function getFilesToDeleteIdsLen(filesToDeleteIds: string | string[] | undefined) {
  const filesToDeleteIdsLen = convertFilesToDeleteIdsToArr(
    filesToDeleteIds
  ).length;

  return filesToDeleteIdsLen;
}

export function convertFilesToDeleteIdsToArr(filesToDeleteIds: string | string[] | undefined) {
  let result: string[];

  if (typeof filesToDeleteIds === "string") {
    result = [filesToDeleteIds];
  } else if (!filesToDeleteIds) {
    result = [];
  } else {
    result = JSON.parse(JSON.stringify(filesToDeleteIds));
  }

  return result;
}


function throwIfTotalFileCountOverLimit(totalFileCount: number, limit: number) {
  if (totalFileCount > limit) {
    const msg = getFileCountExceedsLimitMsg(imgsUploadLimit);
    throw new BadRequestErr(msg);
  }
}
