import requests from "supertest";
import app from "../../../app";
import { authHeader1, jpegImgPath, user1 } from "../posts.test";


export default async function makeRequest(imgsAmount: number, textContent: string | null) {
  const request = requests(app)
    .post(`/users/${user1.profilePath}/posts`)
    .set("Authorization", authHeader1);
  if (textContent) request.field("content", textContent);
  
  for (let i = 0; i < imgsAmount; i++) {
    request.attach("imgs", jpegImgPath);
  }

  return request;
}