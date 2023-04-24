import { Options } from "multer";
import path from "node:path";

const allowedFileExts = [".png", ".svg", ".jpg", ".jpeg", ".heic"]

const multerOptions: Options = {
  fileFilter(req, file, callback) {
    const fileExt = path.extname(file.originalname);
    if (allowedFileExts.includes(fileExt)) {
      callback(null, true);
    } else {
      const err = new Error(`Forbidden file extension. You can only use ${allowedFileExts} extensions`);
      callback(err);
    }
  }
}

export default multerOptions;
