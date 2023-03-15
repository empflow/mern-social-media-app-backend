import { DiskStorageOptions } from "multer";

const multerDiskStorageConf: DiskStorageOptions = {
  destination(req, file, callback) {
    callback(null, "public/assets");
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
}

export default multerDiskStorageConf;