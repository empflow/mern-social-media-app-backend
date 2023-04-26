import sharp from "sharp";

export default async function optimizeImg(img: Buffer) {
  const quality = getCompressionQuality(img.byteLength);
  const shouldCompress = quality !== null;
  
  console.log(`${(img.byteLength / 1000000).toFixed(2)}mb`);
  console.log(`shouldCompress: ${shouldCompress}`);
  if (!shouldCompress) return img;
  
  const optimizedImg = await sharp(img)
    .webp({ quality, alphaQuality: 75 })
    .toBuffer();

  return optimizedImg;
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
