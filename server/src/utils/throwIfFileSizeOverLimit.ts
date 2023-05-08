import { BadRequestErr } from "./errs";


export default function throwIfFileSizeOverLimit(
  file: Buffer, limitInMb: number, options?: { msg: string }
) {
  const sizeInMb = file.byteLength / 1000000;
  if (sizeInMb > limitInMb) {
    const sizeInMbFixed = sizeInMb.toFixed(2);
    throw new BadRequestErr(options?.msg ?? `File too large (${sizeInMbFixed}mb)`);
  }
}
