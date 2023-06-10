import { IAvatarUrls } from "../models/User";
import { optimizeImgForAvatar, optimizeImgForPreview, optimizeImgForTinyPreview } from "./optimizeImg";
import { s3Upload } from "./s3";
import throwIfFileExceedsSizeLimit from "./throwIfFileExceedsSizeLimit";


export default async function optimizeAvatarAndUploadIn3Sizes(
  img: Buffer
): Promise<IAvatarUrls> {
  throwIfFileExceedsSizeLimit(img, 8);

  const [avatarImg, previewImg, tinyPreviewImg] = await Promise.all([
    optimizeImgForAvatar(img),
    optimizeImgForPreview(img),
    optimizeImgForTinyPreview(img)
  ]);

  throwIfFileExceedsSizeLimit(avatarImg, 1);
  throwIfFileExceedsSizeLimit(previewImg, 0.5);
  throwIfFileExceedsSizeLimit(tinyPreviewImg, 0.2);

  const [avatarImgUpload, previewImgUpload, tinyPreviewImgUpload] = await Promise.all([
    s3Upload(avatarImg),
    s3Upload(previewImg),
    s3Upload(tinyPreviewImg),
  ]);

  return {
    avatarUrl400px: avatarImgUpload.Location,
    avatarUrl200px: previewImgUpload.Location,
    avatarUrl100px: tinyPreviewImgUpload.Location
  }
}
