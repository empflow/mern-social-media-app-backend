import requests from "supertest";
import mongoose from "mongoose";
import User, { maxLengths, minLengths } from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import app from "../index";
import getStrOfLength from "../utils/getStrOfLength";
import fieldIsOfLength from "./helpers/fieldIsOfLength";
import expectJson from "./helpers/assertJson";
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
      it("returns 201 created user and token (no password)", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

          expectJson(headers);
          expect(statusCode).toBe(201);
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
          expect(body.password).toBeUndefined();
      })
    })

    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);

        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        expectJson(headers);
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
        
        expectJson(headers);
        expect(body.message).toMatch(/password is required/i);
        expect(statusCode).toBe(400);
      })
    })

    fieldIsOfLength("firstName", 30);
    fieldIsOfLength("firstName", 29);
    fieldIsOfLength("firstName", 31);
    fieldIsOfLength("firstName", 3);
    fieldIsOfLength("firstName", 2);

    fieldIsOfLength("lastName", 30);
    fieldIsOfLength("lastName", 29);
    fieldIsOfLength("lastName", 31);
    fieldIsOfLength("lastName", 3);
    fieldIsOfLength("lastName", 2);

    fieldIsOfLength("profilePath", 30);
    fieldIsOfLength("profilePath", 29);
    fieldIsOfLength("profilePath", 31);
    fieldIsOfLength("profilePath", 3);
    fieldIsOfLength("profilePath", 2);

    describe("create user with invalid profile path", () => {
      it("returns 400 BadRequest error", async () => {
        const invalidProfilePath = "$hello#";

        await expect(User.create({ ...userDataForModel, profilePath: invalidProfilePath }))
          .rejects.toThrow();
      })
    })
  })
})
