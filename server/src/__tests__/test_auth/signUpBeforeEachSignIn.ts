import requests from "supertest";
import app from "../../app";
import { signUpData } from "./auth.test";

export default async function signUpBeforeEachSignIn() {
  await requests(app)
    .post("/auth/sign-up")
    .send(signUpData);
}
