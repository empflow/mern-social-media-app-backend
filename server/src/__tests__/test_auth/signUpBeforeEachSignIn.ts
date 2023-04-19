import requests from "supertest";
import app from "../../app";
import assertJson from "../utils/assertJson";
import getSignUpData from "./getSignUpData";

export default async function signUpBeforeEachSignIn() {
  const signUpData = getSignUpData();

  const { headers } = await requests(app)
    .post("/auth/sign-up")
    .send(signUpData);
  assertJson(headers);
}