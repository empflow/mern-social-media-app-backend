import { nanoid } from "nanoid";

export default function getS3FileName(options?: { amount: number }) {
  if (!options?.amount) {
    return `${nanoid(20)}-${Date.now()}.webp`;
  }
  
  const fileNames: string[] = [];
  for (let i = 0; i < options.amount; i++) {
    const fileName = `${nanoid(20)}-${Date.now()}.webp`;
    fileNames.push(fileName);
  }

  return fileNames;
}