export default function fileArrToBuffers(files: Express.Multer.File[]) {
  return files.map(file => file.buffer);
}