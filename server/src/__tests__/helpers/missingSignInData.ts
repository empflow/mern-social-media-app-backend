import expectJson from "./assertJson";
import { TSignInData } from "./signUpAndSignInInterfaces";
import requests from "supertest";
import app from "../../index";
import getSignUpData from "./getSignUpData";
import signUpDataToSignInData from "./singUpDataToSignInData";

export default async function someSignInDataIsMissing(missingData: keyof TSignInData) {
  const signUpData = getSignUpData();
  const signInData = signUpDataToSignInData(signUpData);

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