import { NextFunction } from "express";
import { IPost, IPostImg } from "../../../models/Post";
import { IReq, IRes } from "../../../utils/reqResInterfaces";
import { convertFilesToDeleteIdsToArr } from "../../comments/patchComment/validator";

export default function patchPostDeleteImgsIfNeeded(req: IReq, res: IRes, next: NextFunction) {
  const { filesToDeleteIds } = req.body;
  const filesToDeleteIdsArr = convertFilesToDeleteIdsToArr(filesToDeleteIds);
  const post: IPost = req.data.post;

  const updatedImgs = post.imgs.filter(imgObj => filterImgs(imgObj, filesToDeleteIdsArr));
  post.imgs = updatedImgs;

  req.data.post = post;
  next();
}


function filterImgs(imgObj: IPostImg, filesToDeleteIds: string[]) {
  const id = imgObj._id;

  if (!id) return true;
  if (filesToDeleteIds.includes(id.toString())) return false;
  return true;
}


/*
const { filesToDeleteIds } = req.body;
const { commentId } = req.params;
const filesToDeleteIdsArr = convertFilesToDeleteIdsToArr(filesToDeleteIds);
const comment: IComment = deepCopy(req.data.comment);
const updatedImgsArr = deepCopy(comment.imgs)
  .filter(imgObj => filterImgs(imgObj, filesToDeleteIdsArr));

comment.imgs = updatedImgsArr;

req.data.comment = deepCopy(comment);
next();
*/