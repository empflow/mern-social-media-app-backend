import expectJson from "../utils/assertJson";
import { TSignInData } from "../utils/signUpAndSignInInterfaces";
import requests from "supertest";
import app from "../../server";
import getSignUpData from "./getSignUpData";
import convertSignUpDataToSignInData from "./convertSignUpDataToSignInData";

export default async function testMissingSignInData(missingData: keyof TSignInData) {
  const signUpData = getSignUpData();
  const signInData = convertSignUpDataToSignInData(signUpData);

  describe(`no ${missingData}`, () => {
    it("retuns 400 bad request", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-in")
        .send({ ...signInData, [missingData]: undefined });

      expectJson(headers);
      expect(statusCode).toBe(400);
      expect(body.message).toBe("both email and password must be provided");
    })
  })
}