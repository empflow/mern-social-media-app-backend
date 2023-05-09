export default function getDescribeContent(imgsAmount: number, textContent: string | null) {
  const noContent = imgsAmount < 1 && !textContent;
  const wordEnding = imgsAmount > 1 ? "s" : "";
  let content = "";

  if (noContent) return "not given any content";

  if (imgsAmount < 1) content = "not given any imgs";
  else content = `given ${imgsAmount} .jpeg image${wordEnding}`;

  if (textContent) content += " and given text content";
  else content += " and no text content";

  return content;
}
