import sharp from "sharp";


export async function optimizeImgForFullSize(buffer: Buffer) {
  const quality = getCompressionQualityFullSize(buffer.byteLength);
  const { width, height } = await getWidthAndHeightForFullSizeImg(buffer);

  return sharp(buffer)
    .webp({ quality, alphaQuality: 75 })
    .resize({ fit: "inside", width, height })
    .toBuffer();
}

async function getWidthAndHeightForFullSizeImg(buffer: Buffer) {
  const img = sharp(buffer);
  const metadata = await img.metadata();

  const width = (metadata.width as number) > 1920 ? 1920 : undefined;
  const height = (metadata.height as number) > 1080 ? 1080 : undefined;

  return { width, height };
}


export async function optimizeImgForFeed(buffer: Buffer) {
  const quality = getCompressionQualityForFeed(buffer.byteLength);
  return sharp(buffer).resize({ width: 550 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}


export async function optimizeImgForAvatar(buffer: Buffer) {
  const quality = getCompressionQualityForAvatar(buffer.byteLength);
  return sharp(buffer).resize({ width: 400, height: 400 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}


export async function optimizeImgForPreview(buffer: Buffer) {
  const quality = getCompressionQualityForPreview(buffer.byteLength);
  return sharp(buffer).resize({ width: 200, height: 200 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}


export async function optimizeImgForTinyPreview(buffer: Buffer) {
  const quality = getCompressionQualityForPreview(buffer.byteLength);
  return sharp(buffer).resize({ width: 100, height: 100 }).webp({ quality, alphaQuality: 75 }).toBuffer();
}


function getCompressionQualityFullSize(byteLength: number) {
  // const sizeInMb = byteLength / 1000000;

  // let quality: number;
  // if (sizeInMb > 5) quality = 1;
  // else if (sizeInMb > 3) quality = 5;
  // else if (sizeInMb > 2) quality = 40;
  // else if (sizeInMb > 1) quality = 45;
  // else if (sizeInMb > 0.5) quality = 60;
  // else quality = 70;

  return 75;
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
