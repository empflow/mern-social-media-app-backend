import { S3 } from "aws-sdk";
import getS3FileName from "./getS3FileNames";
import { optimizeImgForAvatar, optimizeImgForPreview, optimizeImgForTinyPreview } from "./optimizeImg";
import { s3Upload } from "./s3";
import throwIfFileSizeOverLimit from "./throwIfFileSizeOverLimit";


type TOptimizeAvatarAndUploadIn3SizesReturnType = {
  avatarImgUpload: S3.ManagedUpload.SendData,
  previewImgUpload: S3.ManagedUpload.SendData,
  tinyPreviewImgUpload: S3.ManagedUpload.SendData,
};

export default async function optimizeAvatarAndUploadIn3Sizes(
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
    s3Upload(avatarImgName),
    s3Upload(previewImgName),
    s3Upload(tinyPreviewImgName),
  ]);

  return { avatarImgUpload, previewImgUpload, tinyPreviewImgUpload };
}
