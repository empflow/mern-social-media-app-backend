import { signUpData } from "../auth.test";
import assertJson from "./assertJson";
import requests from "supertest";
import app from "../../index";

export default function missingSignUpData(missingData: string) {
  describe(`${missingData} is missing`, () => {
    it("returns 400 BadRequest error", async () => {
      const { body, statusCode, headers } = await requests(app)
        .post("/auth/sign-up")
        .send({ ...signUpData, [missingData]: undefined });

      const regexMatch = `Path \`${missingData}\` is required`;
      const regex = new RegExp(regexMatch);

      expect(body.message).toMatch(regex);
      assertJson(headers);
      expect(statusCode).toBe(400);
      expect(body.message).toBeDefined();
    })
  })
}
