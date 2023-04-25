import path from "node:path";

export default function changeFileExt(originalFileName: string, changeExtTo: string) {
  const extName = path.extname(originalFileName);
  const newFileName = originalFileName.replace(extName, changeExtTo);
  return newFileName;
}