import { TSignInData } from "../utils/signUpAndSignInInterfaces";
import requests from "supertest";
import app from "../../app";
import getSignUpData from "../utils/getSignUpData";
import convertSignUpDataToSignInData from "../utils/convertSignUpDataToSignInData";

export default async function testMissingSignInData(missingData: keyof TSignInData) {
  const signUpData = getSignUpData();
  const signInData = convertSignUpDataToSignInData(signUpData);

  describe(`no ${missingData}`, () => {
    it("retuns 400 bad request", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-in")
        .send({ ...signInData, [missingData]: undefined });

      expect(statusCode).toBe(400);
      expect(body.message).toBe("both email and password must be provided");
    })
  })
}