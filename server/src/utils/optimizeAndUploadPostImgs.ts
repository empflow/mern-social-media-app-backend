import getS3FileName from "./getS3FileNames";
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
  checkImgsSizesBeforeUploading(imgs);

  const firstImg = imgs[0];
  const optimizedTinyPreviewPromise = optimizeImgForTinyPreview(firstImg);
  const optimizedImgsPromise = getOptimziedImgsPromise(imgs);

  const [
    optimizedTinyPreview, optimizedImgs
  ] = await Promise.all([optimizedTinyPreviewPromise, optimizedImgsPromise]);

  const optimizedTinyPreivewUploadPromise = s3Upload(optimizedTinyPreview);
  const optimizedImgsUploadsPromise = getOptimizedImgsUploadsPromise(optimizedImgs);

  const [optimizedTinyPreviewUpload, optimizedImgsUploads] = await Promise.all([
    optimizedTinyPreivewUploadPromise, optimizedImgsUploadsPromise
  ]);

  return {
    tinyPreview: optimizedTinyPreviewUpload.Location,
    imgs: optimizedImgsUploads
  }
}

function checkImgsSizesBeforeUploading(imgs: Buffer[]) {
  imgs.forEach(img => throwIfFileSizeOverLimit(img, 8));
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

function getOptimizedImgsUploadsPromise(optimizedImgs: IImg[]): Promise<IImgUploadResult[]> {
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
