import { optimizeImgForFeed, optimizeImgForPreview, optimizeImgForTinyPreview, optimizeImgForFullSize } from "./optimizeImg";
import { s3Upload } from "./s3";
import throwIfFileSizeOverLimit from "./throwIfFileSizeOverLimit";


interface IOptimizeAndUploadPostImgsReturnType {
  tinyPreview: string | undefined,
  imgs: IImgUploadResult[] | undefined
}


interface IImgUploadResult {
  fullSize: string,
  feedSize: string,
  previewSize: string
}


interface IImg {
  fullSize: Buffer,
  feedSize: Buffer,
  previewSize: Buffer
}


export default async function optimizeAndUploadPostImgs(
  imgs: Buffer[]
): Promise<IOptimizeAndUploadPostImgsReturnType> {
  if (!imgs.length) return { tinyPreview: undefined, imgs: undefined };
  checkImgsSizesBelowLimit(imgs, 8);

  const [optimizedTinyPreview, optimizedImgs] = await getOptimizedTinyPreviewAndImgs(imgs);
  const [optimizedTinyPreviewUpload, optimizedImgsUploads] = await uploadOptimizedTinyPreviewAndImgs(
    optimizedTinyPreview, optimizedImgs
  );

  return {
    tinyPreview: optimizedTinyPreviewUpload.Location,
    imgs: optimizedImgsUploads
  }
}


function checkImgsSizesBelowLimit(imgs: Buffer[], limitInMb: number) {
  imgs.forEach(img => throwIfFileSizeOverLimit(img, limitInMb));
}


async function getOptimizedTinyPreviewAndImgs(imgs: Buffer[]) {
  const tinyPreviewUnoptimized = imgs[0];
  const optimizedTinyPreviewPromise = optimizeImgForTinyPreview(tinyPreviewUnoptimized);
  const optimizedImgsPromise = getOptimziedImgsPromise(imgs);

  return Promise.all([optimizedTinyPreviewPromise, optimizedImgsPromise]);
}


function getOptimziedImgsPromise(imgs: Buffer[]) {
  return Promise.all(imgs.map(async img => {
    const [fullSizeImg, feedImg, previewImg] = await Promise.all([
        optimizeImgForFullSize(img),
        optimizeImgForFeed(img),
        optimizeImgForPreview(img)
    ]);

    return { fullSize: fullSizeImg, feedSize: feedImg, previewSize: previewImg };
  }));
}


async function uploadOptimizedTinyPreviewAndImgs(
  optimizedTinyPreview: Buffer, optimizedImgs: IImg[]
) {
  const optimizedTinyPreivewUploadPromise = s3Upload(optimizedTinyPreview);
  const optimizedImgsUploadsPromise = getOptimizedImgsUploadsPromise(optimizedImgs);

  return Promise.all([
    optimizedTinyPreivewUploadPromise, optimizedImgsUploadsPromise
  ]);
}


function getOptimizedImgsUploadsPromise(optimizedImgs: IImg[]) {
  // need to use Promise.all to convert Promise<IImgUploadResult>[] (array of promises)
  // to Promise<IImgUploadResult[]> (promise array)
  return Promise.all(optimizedImgs.map(async imgObj => {
    const [fullSizeUpload, feedSizeUpload, previewSizeUpload] = await Promise.all([
      s3Upload(imgObj.fullSize),
      s3Upload(imgObj.feedSize),
      s3Upload(imgObj.previewSize)
    ]);

    return {
      fullSize: fullSizeUpload.Location,
      feedSize: feedSizeUpload.Location,
      previewSize: previewSizeUpload.Location
    }
  }));
}
