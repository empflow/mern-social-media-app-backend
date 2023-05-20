import requests from "supertest";
import app from "../../app";
import attachNFiles from "../utils/attachNImgs";
import { postByUser1, user1AuthHeader } from "./comments.test";
import { IPatchCommentParams } from "./patchComment";


type TAddCommentParams = Omit<IPatchCommentParams, "comment">;

export default async function addComment(
  data: TAddCommentParams, opts?: { authHeader?: string | null }
) {
  validatePassedData(data);

  const { newImgs: { path: imgsPath, amount: imgsAmount } = {}, content, replyTo } = data;
  let authHeader = opts?.authHeader;
  if (authHeader === undefined) authHeader = user1AuthHeader;
  else if (authHeader === null) authHeader = "";

  const request = requests(app)
    .post(`/posts/${postByUser1.postPath}/comments`)
    .send({ content, replyTo })
    .set("Authorization", authHeader);
  if (imgsAmount) attachNFiles("imgs", imgsPath as string, imgsAmount, request);

  return request;
}


function validatePassedData(data: TAddCommentParams) {
  const { newImgs: { path: imgPath, amount: imgsAmount } = {} } = data;
  if (
    (imgPath !== undefined && imgsAmount === undefined) ||
    (imgPath === undefined && imgsAmount !== undefined)
  ) {
    throw new Error("imgPath and imgsAmount must be either both defined or both undefined");
  }
}
