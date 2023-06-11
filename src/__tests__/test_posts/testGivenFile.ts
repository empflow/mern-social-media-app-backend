import { allowedFileExts } from "../../config/multer";
import requests from "supertest";
import app from "../../app";
import { postByUser1, user1AuthHeader } from "./posts.test";
import path from "path";
import expectImgsUrlsMatchHttps from "../utils/expectImgsUrlsMatchHttps";


/**
 * tests patch post endpoint with a given file as an img to add to the post
 * @param filePath absolute path to the file
 * @throws {Error} if file path is not absolute
 */
export default async function testGivenFile(filePath: string) {
  checkFilePathIsAbsolute(filePath);

  const describeContent = getDescribeContent(filePath);
  const itContent = getItContent(filePath);

  describe(describeContent, () => {
    it(itContent, async () => {
      const response = await sendReq(filePath);
      runExpectations(response, filePath);
    })
  })
}


function checkFilePathIsAbsolute(filePath: string) {
  if (!path.isAbsolute(filePath)) {
    throw new Error("file path must be absolute");
  }
}


function getDescribeContent(filePath: string) {
  const extname = path.extname(filePath);
  return `given ${extname} img`;
}


function getItContent(filePath: string) {
  const extname = path.extname(filePath);
  if (allowedFileExts.includes(extname)) {
    return "returns 200 (allowed file ext)"
  } else {
    return "returns 400 bad request (file ext forbidden)"
  }
}


function sendReq(filePath: string) {
  return requests(app)
    .patch(`/posts/${postByUser1.postPath}`)
    .attach("imgs", filePath)
    .set("Authorization", user1AuthHeader);
}


function runExpectations(response: requests.Response, filePath: string) {
  const extname = path.extname(filePath);
  const { statusCode, body } = response;

  if (allowedFileExts.includes(extname)) {
    expect(statusCode).toBe(200);
    expect(body.imgs.length).toBe(1);
    expectImgsUrlsMatchHttps(body);
    return;
  }

  expect(statusCode).toBe(400);
  expect(body.message).toMatch(/forbidden file extension/i);
}
