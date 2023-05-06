import S3 from "aws-sdk/clients/s3";
import { nanoid } from "nanoid";
import optimizeImg from "./optimizeImg";
import changeFileExt from "./changeFileExt";
import getEnvVar from "./getEnvVar";
import getS3FileNames from "./getS3FileNames";
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

export async function optimizeImgAndUploadIn3Sizes(img: Buffer) {
  throwIfFileSizeOverLimit(img, 8);

  const [optimizedImg400px, optimizedImg100px, optimizedImg50px] = await Promise.all([
      optimizeImg(img, { width: 400, height: 400 }),
      optimizeImg(img, { width: 100, height: 100 }),
      optimizeImg(img, { width: 50, height: 50 })
  ]);

  throwIfFileSizeOverLimit(optimizedImg400px, 1, { msg: "File too large" });
  throwIfFileSizeOverLimit(optimizedImg100px, 1, { msg: "File too large" });
  throwIfFileSizeOverLimit(optimizedImg50px, 1, { msg: "File too large" });

  const [img400pxFileName, img100pxFileName, img50pxFileName] = getS3FileNames(3) as string[];

  return Promise.all([
    s3Upload(img400pxFileName, optimizedImg400px),
    s3Upload(img100pxFileName, optimizedImg100px),
    s3Upload(img50pxFileName, optimizedImg50px)
  ]);
}

async function s3Upload(key: string, body: Buffer | Uint8Array | Blob | string) {
  return s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();
}

export default s3;
