import { DiskStorageOptions } from "multer";
import path from "node:path";
import mkdirIfDoesntExist from "../utils/mkdirIfDoesntExist";

const uploadPath = path.join(__dirname, "../../uploads");

const multerDiskStorageConf: DiskStorageOptions = {
  destination(req, file, cb) {
    mkdirIfDoesntExist(uploadPath);
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const fileName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
}

export default multerDiskStorageConf;
