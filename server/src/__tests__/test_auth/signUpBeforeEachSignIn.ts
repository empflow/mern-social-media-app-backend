import requests from "supertest";
import app from "../../server";
import assertJson from "../utils/assertJson";
import { signUpData } from "./auth.test";

export default async function signUpBeforeEachSignIn() {
  const { headers } = await requests(app)
    .post("/auth/sign-up")
    .send(signUpData);
  assertJson(headers);
}