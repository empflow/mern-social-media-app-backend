import { Express } from "express";
import requests from "supertest";
import { signUpData } from "./auth.test";

export default async function attachAvatarToSignUpReq(app: Express, imgPath: string) {
  return requests(app)
    .post("/auth/sign-up")
    .field("firstName", signUpData.firstName)
    .field("lastName", signUpData.lastName)
    .field("email", signUpData.email)
    .field("password", signUpData.password)
    .attach("avatar", imgPath);
}
