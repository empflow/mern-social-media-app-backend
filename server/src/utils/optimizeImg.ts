import sharp from "sharp";

export async function optimizeImgFullSize(img: Buffer) {
  const quality = getCompressionQualityFullSize(img.byteLength);
  return sharp(img).webp({ quality, alphaQuality: 75 }).toBuffer();
}

export async function optimizeImgForFeed(img: Buffer) {
  const quality = getCompressionQualityForFeed(img.byteLength);
  return sharp(img).resize({ width: 550 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}

export async function optimizeImgForAvatar(img: Buffer) {
  const quality = getCompressionQualityForAvatar(img.byteLength);
  return sharp(img).resize({ width: 400, height: 400 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}

export async function optimizeImgForPreview(img: Buffer) {
  const quality = getCompressionQualityForPreview(img.byteLength);
  return sharp(img).resize({ width: 200, height: 200 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}

export async function optimizeImgForTinyPreview(img: Buffer) {
  const quality = getCompressionQualityForPreview(img.byteLength);
  return sharp(img).resize({ width: 100, height: 100 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}


function getCompressionQualityFullSize(byteLength: number) {
  const sizeInMb = byteLength / 1000000;

  let quality: number;
  if (sizeInMb > 5) quality = 1;
  else if (sizeInMb > 3) quality = 5;
  else if (sizeInMb > 2) quality = 40;
  else if (sizeInMb > 1) quality = 45;
  else if (sizeInMb > 0.5) quality = 60;
  else quality = 70;

  return quality;
}

function getCompressionQualityForFeed(byteLength: number) {
  const sizeInMb = byteLength / 1000000;

  let quality: number;
  if (sizeInMb > 3) quality = 60;
  else if (sizeInMb > 2) quality = 70;
  else if (sizeInMb > 1) quality = 80;
  else quality = 85;

  return quality;
}

function getCompressionQualityForAvatar(byteLength: number) {
  return getCompressionQualityForFeed(byteLength);
}

function getCompressionQualityForPreview(byteLength: number) {
  const sizeInMb = byteLength / 1000000;

  let quality: number;
  if (sizeInMb > 3) quality = 50;
  else if (sizeInMb > 2) quality = 60;
  else if (sizeInMb > 1) quality = 65;
  else if (sizeInMb > 0.5) quality = 70;
  else quality = 75;

  return quality;
}
