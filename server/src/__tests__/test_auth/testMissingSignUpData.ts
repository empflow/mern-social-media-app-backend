import assertJson from "../utils/assertJson";
import requests from "supertest";
import app from "../../index";
import { ISignUpData } from "../utils/signUpAndSignInInterfaces";
import { signInData } from "./auth.test";

export default function testMissingSignUpData(missingData: keyof ISignUpData) {
  describe(`${missingData} is missing`, () => {
    it("returns 400 BadRequest error", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-up")
        .send({ ...signInData, [missingData]: undefined });

      const normalResponseRegexMatch = `Path \`${missingData}\` is required`;
      const normalResponseRegex = new RegExp(normalResponseRegexMatch);
      const passwordResponseRegex = /password is required/;

      if (missingData === "password") {
        expect(body.message).toMatch(passwordResponseRegex);
      } else {
        expect(body.message).toMatch(normalResponseRegex);
      }
      assertJson(headers);
      expect(statusCode).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
}
