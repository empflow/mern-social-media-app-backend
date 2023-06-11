import { Options } from "multer";
import path from "node:path";
import { BadRequestErr } from "../utils/errs";
import multer from "multer";
import { allowedFileExts } from "./global";


const multerOptions: Options = {
  fileFilter(req, file, callback) {
    const fileExt = path.extname(file.originalname);

    if (allowedFileExts.includes(fileExt)) {
      callback(null, true);
    } else {
      const formattedAllowedFileExts = getFormattedAllowedFileExts();
      const err = new BadRequestErr(
        `Forbidden file extension. You can only use ${formattedAllowedFileExts} extensions`
      );
      callback(err);
    }
  }
}

function getFormattedAllowedFileExts() {
  let result = "";
  allowedFileExts.forEach((ext, i) => (
    result += `${ext}${allowedFileExts.length - 1 === i ? "" : " "}`
  ));
  
  return result;
}

export function getFileCountExceedsLimitMsg(limit: number) {
  return `you've exceeded the limit of ${limit} files`;
}


export const upload = multer(multerOptions);
export default multerOptions;
