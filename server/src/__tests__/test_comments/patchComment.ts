import { IComment } from "../../models/Comment";
import requests from "supertest";
import app from "../../app";
import { user1AuthHeader } from "./comments.test";


interface IData {
  content?: string,
  replyTo?: string,
  commentToPatch: IComment,
  filesToDeleteIds?: string[],
  newImgs?: { path: string, amount: number }
};


export default async function patchComment(data: IData) {
  const { statusCode, body } = await sendReq(data);
  console.log(statusCode);
  console.log(body);
}


function sendReq(data: IData) {
  const { commentToPatch, content, filesToDeleteIds, newImgs, replyTo } = data;

  const req = requests(app).patch(`/comments/${commentToPatch.id}`);
  if (content) req.field("content", content);
  if (replyTo) req.field("replyTo", replyTo);
  if (filesToDeleteIds) {
    filesToDeleteIds.forEach(id => req.field("filesToDeleteIds", id));
  }
  if (newImgs) {
    for (let i = 0; i < newImgs.amount; i++) {
      req.attach("imgs", newImgs.path);
    }
  }
  req.set("Authorization", user1AuthHeader);

  return req;
}
