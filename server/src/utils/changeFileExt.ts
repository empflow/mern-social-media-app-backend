import path from "node:path";

export default function changeFileExt(originalFileName: string, changeExtToIncludingDot: string) {
  const extName = path.extname(originalFileName);
  const newFileName = originalFileName.replace(extName, changeExtToIncludingDot);
  return newFileName;
}