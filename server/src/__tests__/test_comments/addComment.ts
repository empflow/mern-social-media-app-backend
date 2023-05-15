import requests from "supertest";
import app from "../../app";
import { postByUser1, user1AuthHeader } from "./comments.test";

export default async function addComment(content?: string, replyTo?: string) {
  const { statusCode, body } = await requests(app)
    .post(`/posts/${postByUser1.postPath}/comments`)
    .send({ content, replyTo })
    .set("Authorization", user1AuthHeader);

  return { statusCode, body };
}