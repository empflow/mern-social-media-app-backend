import { NextFunction } from "express";
import fileArrToBuffers from "../../utils/fileArrToBuffers";
import optimizeAndUploadPostImgs from "../../utils/optimizeAndUploadPostImgs";
import { IReq, IRes } from "../../utils/reqResInterfaces";


export default async function postUploadImgsIfPresent(
  req: IReq, res: IRes, next: NextFunction
) {
  const imgs = req.files;

  const noImagesProvided = !imgs?.length;
  if (noImagesProvided) {
    req.data.upload = { tinyPreview: undefined, imgs: undefined };
  } else {
    const buffers = fileArrToBuffers(imgs as Express.Multer.File[]);
    const upload = await optimizeAndUploadPostImgs(buffers);
    req.data.upload = upload;
  }

  next();
}
