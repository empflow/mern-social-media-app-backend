import S3 from "aws-sdk/clients/s3";
import { nanoid } from "nanoid";
import { optimizeImgFullSize, optimizeImgForFeed, optimizeImgForPreview, optimizeImgForTinyPreview, optimizeImgForAvatar } from "./optimizeImg";
import changeFileExt from "./changeFileExt";
import getEnvVar from "./getEnvVar";
import getS3FileName from "./getS3FileNames";
import throwIfFileSizeOverLimit from "./throwIfFileSizeOverLimit";

export const bucketName = getEnvVar("S3_BUCKET_NAME");
export const region = getEnvVar("S3_REGION");
export const endpoint = getEnvVar("S3_ENDPOINT");
const accessKeyId = getEnvVar("S3_ACCESS_KEY_ID");
const secretAccessKey = getEnvVar("S3_SECRET_ACCESS_KEY");

const s3 = new S3({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region,
  endpoint,
  apiVersion: "latest",
  s3ForcePathStyle: true
});

type TOptimizeAvatarAndUploadIn3SizesReturnType = {
  avatarImgUpload: S3.ManagedUpload.SendData,
  previewImgUpload: S3.ManagedUpload.SendData,
  tinyPreviewImgUpload: S3.ManagedUpload.SendData,
};

export async function optimizeAvatarAndUploadIn3Sizes(
  img: Buffer
): Promise<TOptimizeAvatarAndUploadIn3SizesReturnType> {
  throwIfFileSizeOverLimit(img, 8);

  const [avatarImg, previewImg, tinyPreviewImg] = await Promise.all([
    optimizeImgForAvatar(img),
    optimizeImgForPreview(img),
    optimizeImgForTinyPreview(img)
  ]);

  throwIfFileSizeOverLimit(avatarImg, 1);
  throwIfFileSizeOverLimit(previewImg, 0.5);
  throwIfFileSizeOverLimit(tinyPreviewImg, 0.2);

  const [
    avatarImgName, previewImgName, tinyPreviewImgName
  ] = getS3FileName({ amount: 3 }) as string[];

  const [avatarImgUpload, previewImgUpload, tinyPreviewImgUpload] = await Promise.all([
    s3Upload(avatarImgName, avatarImg),
    s3Upload(previewImgName, previewImg),
    s3Upload(tinyPreviewImgName, tinyPreviewImg),
  ]);

  return { avatarImgUpload, previewImgUpload, tinyPreviewImgUpload };
}

export async function optimizeImgAndUploadIn4Sizes(img: Buffer) {
  throwIfFileSizeOverLimit(img, 8);

  const [fullSizeImg, feedImg, previewImg, tinyPreviewImg] = await Promise.all([
      optimizeImgFullSize(img),
      optimizeImgForFeed(img),
      optimizeImgForPreview(img),
      optimizeImgForTinyPreview(img),
  ]);

  throwIfFileSizeOverLimit(fullSizeImg, 1.2);
  throwIfFileSizeOverLimit(feedImg, 1);
  throwIfFileSizeOverLimit(previewImg, 0.5);
  throwIfFileSizeOverLimit(tinyPreviewImg, 0.2);

  const [
    fullSizeImgName, feedImgName, previewImgName, tinyPreviewImgName
  ] = getS3FileName({ amount: 4 }) as string[];

  const [fullSizeImgUpload, feedImgUpload, previewImgUpload, tinyPreviewImgUpload] = await Promise.all([
    s3Upload(fullSizeImgName, fullSizeImg),
    s3Upload(feedImgName, feedImg),
    s3Upload(previewImgName, previewImg),
    s3Upload(tinyPreviewImgName, tinyPreviewImg)
  ]);

  return { fullSizeImgUpload, feedImgUpload, previewImgUpload, tinyPreviewImgUpload };
}

async function s3Upload(key: string, body: Buffer | Uint8Array | Blob | string) {
  return s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();
}

export default s3;
