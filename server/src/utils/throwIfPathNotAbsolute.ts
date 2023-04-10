import path from "node:path";

export default function throwIfPathNotAbsolute(pathToCheck: string) {
  if (!path.isAbsolute(pathToCheck)) {
    throw new Error("path must be absolute");
  }
}