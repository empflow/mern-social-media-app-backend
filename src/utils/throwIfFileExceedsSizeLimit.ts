import { BadRequestErr } from "./errs";


export default function throwIfFileExceedsSizeLimit(
  files: Buffer | Buffer[], limitInMb: number
) {
  if (Array.isArray(files)) {
    files.forEach(file => checkAndThrowIfNeeded(file, limitInMb));
  } else {
    checkAndThrowIfNeeded(files, limitInMb);
  }
}


function checkAndThrowIfNeeded(file: Buffer, limitInMb: number) {
  const sizeInMb = file.byteLength / 1_000_000;
  if (sizeInMb > limitInMb) {
    const sizeInMbFixed = sizeInMb.toFixed(2);
    throw new BadRequestErr(`File too large (${sizeInMbFixed}mb)`);
  }
}
