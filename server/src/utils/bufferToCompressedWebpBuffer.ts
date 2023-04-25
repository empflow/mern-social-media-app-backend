import sharp from "sharp";

export default async function bufferToCompressedWebpBuffer(buffer: Buffer) {
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 40, alphaQuality: 75 })
    .toBuffer();

  return webpBuffer;
}