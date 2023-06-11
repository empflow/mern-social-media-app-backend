import { NextFunction } from "express";
import { IPost, IPostImg } from "../../../models/Post";
import convertFilesToDeleteIdsToArr from "../../../utils/convertFilesToDeleteIdsToArr";
import { IReq, IRes } from "../../../utils/reqResInterfaces";


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
