import { IComment } from "../../models/Comment";
import requests from "supertest";
import app from "../../app";
import { user1AuthHeader } from "./comments.test";
import checkReplyToCommentExists from "../../utils/checkReplyToCommentExists";
import request from "superagent";


interface IData {
  content?: string,
  replyTo?: string,
  comment: IComment,
  filesToDeleteIds?: string[],
  newImgs?: { path: string, amount: number }
};


export default async function patchComment(data: IData) {
  const response = await sendReq(data);
  runExpectations(data, response);
}


function sendReq(data: IData) {
  const { comment, content, filesToDeleteIds, newImgs, replyTo } = data;

  const req = requests(app).patch(`/comments/${comment.id}`);
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


async function runExpectations(data: IData, response: request.Response) {
  const { content, replyTo } = data;
  const replyToCommExists = await checkReplyToCommentExists(replyTo, { shouldReturnBool: true });

  const expecterArgs = { replyTo, replyToCommExists, response, content };
  const shouldReturn = replyToCommDoesntExistExpecter(expecterArgs);
  if (shouldReturn) return;
  contentExpecter(expecterArgs);
  givenReplyToAndReplyToCommExistsExpecter(expecterArgs);
  totalImgsAmountExpecter(data, expecterArgs);
}


interface IExpecterFnParams {
  response: request.Response,
  replyTo: string | undefined,
  replyToCommExists: boolean | undefined,
  content: string | undefined
}


function replyToCommDoesntExistExpecter({ response, replyTo, replyToCommExists }: IExpecterFnParams) {
  if (replyTo && !replyToCommExists) {
    const { statusCode, body } = response;
    expect(statusCode).toBe(404);
    expect(body.message).toMatch(/comment you're trying to reply to does not exist/);
    const shouldCallerReturn = true;
    return shouldCallerReturn;
  }
}


function givenReplyToAndReplyToCommExistsExpecter(
  { response: { body }, replyTo, replyToCommExists }: IExpecterFnParams
) {
  if (replyTo && replyToCommExists) {
    expect(body.replyTo).toBe(replyTo);
  }
}


function contentExpecter({ response: { body }, content }: IExpecterFnParams) {
  if (content) {
    expect(body.content).toBe(content);
  }
}


function totalImgsAmountExpecter(
  data: IData, { response: { body } }: IExpecterFnParams
) {
  const { newImgs, filesToDeleteIds, comment } = data;

  const newImgsAmount = newImgs?.amount ?? 0;
  const imgsToDeleteAmount = filesToDeleteIds?.length ?? 0;
  const amountToExpect =  comment.imgs.length + newImgsAmount - imgsToDeleteAmount;
  expect(body.imgs.length).toBe(amountToExpect);
}
