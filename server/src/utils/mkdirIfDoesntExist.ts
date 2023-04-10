import fs from "node:fs";
import throwIfPathNotAbsolute from "./throwIfPathNotAbsolute";

export default function mkdirIfDoesntExist(dirPath: string) {
  throwIfPathNotAbsolute(dirPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdir(dirPath, (err) => {
      if (err) throw err;
    });
  }
}
