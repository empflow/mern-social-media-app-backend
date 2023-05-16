import s3 from "./s3";
import { ICommentImg } from "../models/Comment";
import { optimizeImgForFullSize, optimizeImgForPreview } from "./optimizeImg";
import { s3Upload } from "./s3";
import { S3 } from "aws-sdk";

// export interface ICommentImg {
//   previewSize: string,
//   fullSize: string
// }

export default async function optimizeAndUploadCommentImgs(
  imgs: Buffer[]
): Promise<ICommentImg[] | undefined> {
  if (!imgs.length) return undefined;

  const optimizedPreviewImgs = await getOptimizedPreviewImgs(imgs);
  const optimizedFullSizeImgs = await getOptimizedFullSizeImgs(imgs);
  
  const [previewImgsUpload, fullSizeImgsUpload] = await uploadPreviewAndFullSizeImgs(
    optimizedPreviewImgs, optimizedFullSizeImgs
  )

  return convertPreviewsAndFullSizeImgsUploadsToSingleArr(previewImgsUpload, fullSizeImgsUpload);
}

async function getOptimizedPreviewImgs(imgs: Buffer[]) {
  const promises = imgs.map(img => optimizeImgForPreview(img));
  return Promise.all(promises);
}

async function getOptimizedFullSizeImgs(imgs: Buffer[]) {
  const promises = imgs.map(img => optimizeImgForFullSize(img));
  return Promise.all(promises);
}

async function uploadPreviewAndFullSizeImgs(previewImgs: Buffer[], fullSizeImgs: Buffer[]) {
  const previewImgsUploadPromise = Promise.all(previewImgs.map(img => s3Upload(img)));
  const fullSizeImgsUploadPromise = Promise.all(fullSizeImgs.map(img => s3Upload(img)));
  return Promise.all([previewImgsUploadPromise, fullSizeImgsUploadPromise]);
}

async function uploadImgs(imgs: Buffer[]) {
  return Promise.all(imgs.map(img => s3Upload(img)));
}

function convertPreviewsAndFullSizeImgsUploadsToSingleArr(
  previewImgsUploads: S3.ManagedUpload.SendData[], fullSizeImgsUploads: S3.ManagedUpload.SendData[]
) {
  if (previewImgsUploads.length !== fullSizeImgsUploads.length) {
    throw new Error("different amounts of preview and full size imgs");
  }

  const result = [];
  for (let i = 0; i < previewImgsUploads.length; i++) {
    const previewImg = previewImgsUploads[i];
    const fullSizeImg = fullSizeImgsUploads[i];
    const imgObj: ICommentImg = {
      previewSize: previewImg.Location,
      fullSize: fullSizeImg.Location
    }

    result.push(imgObj);
  }

  return result;
}
