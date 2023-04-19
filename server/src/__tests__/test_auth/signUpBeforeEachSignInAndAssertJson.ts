import requests from "supertest";
import app from "../../app";
import assertJson from "../utils/assertJson";
import { signUpData } from "./auth.test";

export default async function signUpBeforeEachSignInAndAssertJson() {
  const { headers } = await requests(app)
    .post("/auth/sign-up")
    .send(signUpData);
  assertJson(headers);
}