import requests from "supertest";
import app from "../../app";
import attachNFiles from "../utils/attachNImgs";
import { postByUser1, user1AuthHeader } from "./comments.test";


interface IData {
  content?: string,
  replyTo?: string
  media?: {
    imgsAmount: number,
    imgPath: string
  },
  authHeader?: string | null
}


export default async function addComment(data: IData) {
  validatePassedData(data);

  const { media: { imgPath, imgsAmount } = {}, content, replyTo } = data;
  let authHeader = data.authHeader;
  if (authHeader === undefined) authHeader = user1AuthHeader;
  else if (authHeader === null) authHeader = "";

  const request = requests(app)
    .post(`/posts/${postByUser1.postPath}/comments`)
    .send({ content, replyTo })
    .set("Authorization", authHeader);
  if (imgsAmount) attachNFiles("imgs", imgPath as string, imgsAmount, request);

  return request;
}

function validatePassedData(data: IData) {
  const { media: { imgPath, imgsAmount } = {} } = data;
  if (
    (imgPath !== undefined && imgsAmount === undefined) ||
    (imgPath === undefined && imgsAmount !== undefined)
  ) {
    throw new Error("imgPath and imgsAmount must be either both defined or both undefined");
  }
}
