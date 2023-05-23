import S3 from "aws-sdk/clients/s3";
import getEnvVar from "./getEnvVar";
import getS3FileName from "./getS3FileNames";


export const imgsUploadLimit = 10;
export const vidsUploadLimit = 2;

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


export async function s3Upload(body: Buffer | Uint8Array | Blob | string) {
  const key = getS3FileName() as string;
  return s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();
}


export default s3;
