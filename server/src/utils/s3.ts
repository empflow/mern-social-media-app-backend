import S3 from "aws-sdk/clients/s3";
import { nanoid } from "nanoid";
import { optimizeImgFullSize, optimizeImgForFeed, optimizeImgForGridPreview, optimizeImgForAvatar } from "./optimizeImg";
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
})

export async function optimizeImgAndUploadIn4Sizes(img: Buffer) {
  throwIfFileSizeOverLimit(img, 8, { msg: "File too large" });

  const [optimizedImgFullSize, optimizedImgForFeed, optimizedImgForGridPreview, optimizedImgForAvatar] = await Promise.all([
      optimizeImgFullSize(img),
      optimizeImgForFeed(img),
      optimizeImgForGridPreview(img),
      optimizeImgForAvatar(img),
  ]);

  const opts = { msg: "File too large" };
  throwIfFileSizeOverLimit(optimizedImgFullSize, 1.2, opts);
  throwIfFileSizeOverLimit(optimizedImgForFeed, 1, opts);
  throwIfFileSizeOverLimit(optimizedImgForGridPreview, 0.5, opts);
  throwIfFileSizeOverLimit(optimizedImgForAvatar, 0.2, opts);

  const [
    fullSizeImgName, feedImgName, gridPreviewImgName, avatarImgName
  ] = getS3FileName({ amount: 4 }) as string[];

  return Promise.all([
    s3Upload(fullSizeImgName, optimizedImgFullSize),
    s3Upload(feedImgName, optimizedImgForFeed),
    s3Upload(gridPreviewImgName, optimizedImgForGridPreview),
    s3Upload(avatarImgName, optimizedImgForAvatar)
  ]);
}

async function s3Upload(key: string, body: Buffer | Uint8Array | Blob | string) {
  return s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();
}

export default s3;
