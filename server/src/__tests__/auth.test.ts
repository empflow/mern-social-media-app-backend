import requests from "supertest";
import mongoose from "mongoose";
import User, { maxLengths, minLengths } from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import app from "../index";
import getStrOfLength from "../utils/getStrOfLength";
import fieldIsOfLength from "./helpers/fieldIsOfLength";
import assertJson from "./helpers/assertJson";
import missingSignUpData from "./helpers/someSignUpDataIsMissing";


beforeEach(async () => {
  await User.deleteMany({});
});

export const signUpData = {
  firstName: "john",
  lastName: "doe",
  email: "johndoe@gmail.com",
  password: "1234567890"
};

export const userDataForModel = {
  ...signUpData,
  profilePath: getRandomProfilePath()
}

describe("auth", () => {
  describe("sing-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns 201 created user and token", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

          assertJson(headers);
          expect(statusCode).toBe(201);
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
      })
    })

    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);

        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        assertJson(headers);
        expect(body.message).toBeDefined();
        expect(statusCode).toBe(409);
      })
    })

    missingSignUpData("firstName");
    missingSignUpData("lastName");
    missingSignUpData("email");

    describe("password is missing", () => {
      it("returns password missing error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send({ ...signUpData, password: undefined });
        
        assertJson(headers);
        expect(body.message).toMatch(/password is required/i);
        expect(statusCode).toBe(400);
      })
    })

    fieldIsOfLength("firstName", 30, maxLengths.firstName, minLengths.firstName);
    fieldIsOfLength("firstName", 29, maxLengths.firstName, minLengths.firstName);
    fieldIsOfLength("firstName", 31, maxLengths.firstName, minLengths.firstName);
    fieldIsOfLength("firstName", 3, maxLengths.firstName, minLengths.firstName);
    fieldIsOfLength("firstName", 2, maxLengths.firstName, minLengths.firstName);
  })
})
