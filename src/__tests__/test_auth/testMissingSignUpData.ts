import requests from "supertest";
import { ISignUpData } from "../utils/signUpAndSignInInterfaces";
import getSignUpData from "../utils/getSignUpData";
import app from "../../app";

export default function testMissingSignUpData(missingData: keyof ISignUpData) {
  const signUpData = getSignUpData();

  describe(`${missingData} is missing`, () => {
    it("returns 400 BadRequest error", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-up")
        .send({ ...signUpData, [missingData]: undefined });

      const normalResponseRegexMatch = `Path \`${missingData}\` is required`;
      const normalResponseRegex = new RegExp(normalResponseRegexMatch);
      const passwordResponseRegex = /password is required/;

      if (missingData === "password") {
        expect(body.message).toMatch(passwordResponseRegex);
      } else {
        expect(body.message).toMatch(normalResponseRegex);
      }
      
      expect(statusCode).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
}
