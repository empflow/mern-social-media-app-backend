import sharp from "sharp";

export default async function bufferToWebpBuffer(buffer: Buffer) {
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 40, alphaQuality: 75 })
    .toBuffer();

  return webpBuffer;
}