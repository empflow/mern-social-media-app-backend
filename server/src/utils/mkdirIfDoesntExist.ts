import fs from "node:fs";
import path from "node:path";

export default function mkdirIfDoesntExist(dirPath: string) {
  throwIfPathNotAbsolute(dirPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdir(dirPath, (err) => {
      if (err) throw err;
    });
  }
}

function throwIfPathNotAbsolute(pathToCheck: string) {
  if (!path.isAbsolute(pathToCheck)) {
    throw new Error("path must be absolute");
  }
}
