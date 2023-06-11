import path from "path";
import app from "../../app";
import requests from "supertest";
import { postByUser1 } from "./comments.test";
import { user1AuthHeader } from "./comments.test";
import attachNFiles from "../utils/attachNImgs";
import expectCommentImgsUrlsMatchHttps from "./expectCommentImgsUrlsMatchHttps";
import expectMetadataToBeZero from "./expectMetadataToBeZero";
import { imgsUploadLimit } from "../../utils/s3";
import { allowedFileExts, getFileCountExceedsLimitMsg } from "../../config/multer";


export default async function testAddCommentGiven(
  data: { imgPath: string, imgsAmount: number, content: string | null }
) {
  const { imgPath, imgsAmount, content } = data;

  const describeContent = getDescribeContent({ imgPath, imgsAmount, content });
  const itContent = getItContent({ imgPath, imgsAmount, content });
  const extname = path.extname(imgPath);

  describe(describeContent, () => {
    it(itContent, async () => {
      const { body, statusCode } = await sendReq({ imgPath, imgsAmount, content });
      runExpectations({ body, extname, imgsAmount, statusCode, content });
    }, 10000)
  })
}


function getDescribeContent(data: { imgPath: string, imgsAmount: number, content: string | null }) {
  const { imgPath, imgsAmount, content } = data;
  const extname = path.extname(imgPath);
  const wordEnding = imgsAmount > 1 ? "s" : "";

  let result = "";
  if (!content) result += "not given text content";
  else result += "given text content";

  result += ` and`
  result += imgsAmount > 0 ? ` ${imgsAmount} ${extname} image${wordEnding}` : " no images"

  return result;
}


function getItContent(data: { imgPath: string, imgsAmount: number, content: string | null }) {
  const { imgPath, imgsAmount, content } = data;
  const extname = path.extname(imgPath);
  let result = "";
  const wordEnding = imgsAmount > 1 ? "s" : "";

  if (
    imgsAmount > imgsUploadLimit ||
    !allowedFileExts.includes(extname) ||
    (!imgsAmount && !content)
  ) {
    result += "returns 400 bad request";
    return result;
  } else {
    result += "returns 201 created";
  }

  if (content) result += " and content"
  else result += " (no content)"

  if (imgsAmount) result += ` and img url${wordEnding}`;

  return result;
}


function sendReq(data: { imgPath: string, imgsAmount: number, content: string | null }) {
  const { imgsAmount, imgPath, content } = data;

  const request = requests(app)
    .post(`/posts/${postByUser1.postPath}/comments`)
    .set("Authorization", user1AuthHeader);
  if (content) request.field("content", content);
  return attachNFiles("imgs", imgPath, imgsAmount, request);
}


function runExpectations(data: { imgsAmount: number, body: any, statusCode: number, extname: string, content: string | null }) {
  const { imgsAmount, statusCode, body, extname, content } = data;

  if (!imgsAmount && !content) {
    expect(statusCode).toBe(400);
    expect(body.message).toMatch(/no data provided/);
  } else if (imgsAmount > imgsUploadLimit) {
    expect(statusCode).toBe(400);
    const matchStr = getFileCountExceedsLimitMsg(imgsUploadLimit);
    expect(body.message).toMatch(matchStr);
  } else if (!allowedFileExts.includes(extname)) {
    expect(statusCode).toBe(400);
    expect(body.message).toMatch(/Forbidden file extension/);
  } else {
    expect(statusCode).toBe(201);
    expectMetadataToBeZero(body);
    if (imgsAmount) {
      expectCommentImgsUrlsMatchHttps(body);
    }
  }
}
