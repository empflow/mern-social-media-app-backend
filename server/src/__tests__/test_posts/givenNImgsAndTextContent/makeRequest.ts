import { HydratedDocument } from "mongoose";
import requests from "supertest";
import app from "../../../app";
import { IUser } from "../../../models/User";
import getAuthHeader from "../../utils/getToken";
import { authHeader1, jpegImgPath, user1 } from "../posts.test";


export default async function makeRequest(
  imgsAmount: number,
  textContent: string | null,
  options?: {
    asUser: HydratedDocument<IUser>,
    onUser: HydratedDocument<IUser>
  }
) {
  const posterAuthHeader = options?.asUser.id ? getAuthHeader(options.asUser.id) : authHeader1;
  const userToPostToProfilePath = options?.onUser.profilePath ?? user1.profilePath;

  const request = requests(app)
    .post(`/users/${userToPostToProfilePath}/posts`)
    .set("Authorization", posterAuthHeader);
  if (textContent) request.field("content", textContent);
  
  for (let i = 0; i < imgsAmount; i++) {
    request.attach("imgs", jpegImgPath);
  }

  return request;
}