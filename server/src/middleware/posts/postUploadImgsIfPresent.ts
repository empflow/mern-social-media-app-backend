import { NextFunction } from "express";
import optimizeAndUploadPostImgs from "../../utils/optimizeAndUploadPostImgs";
import { IReq, IRes } from "../../utils/reqResInterfaces";


export default async function postUploadImgsIfPresent(
  req: IReq, res: IRes, next: NextFunction
) {
  const imgs = req.files;

  const wereNoImagesProvided = !imgs?.length;
  if (wereNoImagesProvided) {
    req.data.upload = { tinyPreview: undefined, imgs: undefined };
  } else {
    const buffers = (imgs as Express.Multer.File[]).map(img => img.buffer);
    const upload = await optimizeAndUploadPostImgs(buffers);
    req.data.upload = upload;
  }

  next();
}
