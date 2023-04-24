import { DiskStorageOptions } from "multer";
import path from "node:path";
import mkdirIfDoesntExist from "../utils/mkdirIfDoesntExist";

const uploadPath = path.join(__dirname, "../../uploads");

const multerDiskStorageConf: DiskStorageOptions = {
  destination(req, file, cb) {
    mkdirIfDoesntExist(uploadPath);
    cb(null, uploadPath);
  }
}

export default multerDiskStorageConf;
