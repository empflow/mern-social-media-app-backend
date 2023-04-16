import { signUpData } from "../auth.test";
import expectJson from "./assertJson";
import requests from "supertest";
import app from "../../index";

export default function missingSignUpData(missingData: string) {
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
      expectJson(headers);
      expect(statusCode).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
}
