import { nanoid } from "nanoid";

export default function getS3FileNames(namesAmount?: number) {
  if (!namesAmount) {
    return `${nanoid(20)}-${Date.now()}.webp`;
  }
  
  const fileNames: string[] = [];
  for (let i = 0; i < namesAmount; i++) {
    const fileName = `${nanoid(20)}-${Date.now()}.webp`;
    fileNames.push(fileName);
  }

  return fileNames;
}