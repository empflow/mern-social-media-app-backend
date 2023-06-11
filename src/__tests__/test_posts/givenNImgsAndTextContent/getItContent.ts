import { imgsUploadLimit } from "../../../utils/s3";


export default function getItContent(imgsAmount: number, textContent: string | null) {
  const noContent = imgsAmount < 1 && !textContent;
  if (noContent) return "returns 400 bad request and no content message";

  const wordEnding = imgsAmount > 1 ? "s" : "";
  const exceedsLimit = imgsAmount > imgsUploadLimit;
  let content = "";

  if (exceedsLimit) {
    return `returns 400 bad request because img limit of ${imgsUploadLimit} was exceeded`;
  }

  if (imgsAmount < 1) {
    content = `returns 201 created`;
  } else if (!exceedsLimit) {
    content = `returns 201 created and img${wordEnding} url${wordEnding}`;
  }

  if (textContent) content += " and text content";

  return content;
}
