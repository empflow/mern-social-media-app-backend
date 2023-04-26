import S3 from "aws-sdk/clients/s3";
import optimizeImg from "./bufferToCompressedWebpBuffer";
import changeFileExt from "./changeFileExt";
import getEnvVar from "./getEnvVar";
import throwIfFileSizeOverLimit from "./throwIfBufferOverLimit";

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

export async function optimizeImgAndUpload(img: Buffer, nameWithFileExt: string) {
  throwIfFileSizeOverLimit(img, 8);
  const optimizedImg = await optimizeImg(img);
  throwIfFileSizeOverLimit(optimizedImg, 1, { msg: "File too large" });
  const imgNameWithWebpExt = changeFileExt(nameWithFileExt, ".webp");

  return await s3.upload({
    Bucket: bucketName,
    Key: imgNameWithWebpExt,
    Body: optimizedImg
  }).promise();
}

export default s3;
