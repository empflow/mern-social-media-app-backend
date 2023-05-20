import { IComment } from "../../models/Comment";
import requests from "supertest";
import app from "../../app";
import { user1AuthHeader } from "./comments.test";
import checkReplyToCommentExists from "../../utils/checkReplyToCommentExists";
import request from "superagent";
import { imgsUploadLimit } from "../../utils/s3";


export interface IPatchCommentParams {
  content?: string,
  replyTo?: string,
  comment: IComment,
  filesToDeleteIds?: string[],
  newImgs?: { path: string, amount: number }
};

interface IExpecterFnParams {
  response: request.Response,
  replyTo: string | undefined,
  replyToCommExists: boolean | undefined,
  content: string | undefined
}


export default async function patchComment(data: IPatchCommentParams) {
  const { comment } = data;
  const argsWithResolvedComm = { ...data, comment };
  const response = await sendReq(argsWithResolvedComm);
  runExpectations(argsWithResolvedComm, response);
}


function sendReq(data: IPatchCommentParams) {
  const { comment, content, filesToDeleteIds, newImgs, replyTo } = data;

  const req = requests(app).patch(`/comments/${comment._id}`);
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


async function runExpectations(data: IPatchCommentParams, response: request.Response) {
  const { content, replyTo } = data;
  const replyToCommExists = await checkReplyToCommentExists(replyTo, { shouldReturnBool: true });

  const expecterArgs = { replyTo, replyToCommExists, response, content };
  const shouldReturn = replyToCommDoesntExistExpecter(expecterArgs);
  if (shouldReturn) return;
  contentExpecter(expecterArgs);
  givenReplyToAndReplyToCommExistsExpecter(expecterArgs);
  totalImgsAmountExpecter(data, expecterArgs);
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
  data: IPatchCommentParams, { response: { body, statusCode } }: IExpecterFnParams
) {
  const amountToExpect = getImgsAmountToExpect(data);
  if (amountToExpect > imgsUploadLimit) {
    expect(statusCode).toBe(400);
    expect(body.message).toMatch(/too many imgs/);
  } else {
    expect(statusCode).toBe(200);
    expect(body.imgs.length).toBe(amountToExpect);
  }
}


function getImgsAmountToExpect({ newImgs, filesToDeleteIds, comment }: IPatchCommentParams) {
  const newImgsAmount = newImgs?.amount ?? 0;
  const imgsToDeleteAmount = filesToDeleteIds?.length ?? 0;
  return comment.imgs.length + newImgsAmount - imgsToDeleteAmount;
}
