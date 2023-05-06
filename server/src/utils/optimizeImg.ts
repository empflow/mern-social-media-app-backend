import sharp from "sharp";

export default async function optimizeImg(img: Buffer, size?: { width: number, height: number }) {
  const quality = getCompressionQuality(img.byteLength);
  const shouldCompress = quality !== null;

  if (!shouldCompress) return img;
  
  let optimizedImg = sharp(img)
    .webp({ quality, alphaQuality: 75 })
  if (size) optimizedImg = optimizedImg.resize(size);

  const optimizedImgBuffer = await optimizedImg.toBuffer();


  return optimizedImgBuffer;
}

function getCompressionQuality(byteLength: number) {
  const sizeInMb = byteLength / 1000000;

  let quality: number | null;

  if (sizeInMb > 3) quality = 1;
  else if (sizeInMb > 2) quality = 10;
  else if (sizeInMb > 1) quality = 20;
  else if (sizeInMb > 0.5) quality = 40;
  else if (sizeInMb > 0.3) quality = 50;
  else quality = null;

  return quality;
}
