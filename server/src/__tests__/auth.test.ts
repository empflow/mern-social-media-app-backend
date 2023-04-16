import requests from "supertest";
import User from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import app from "../index";
import signUpFieldIsOfLength from "./helpers/fieldIsOfLength";
import expectJson from "./helpers/assertJson";
import missingSignUpData from "./helpers/someSignUpDataIsMissing";
import getStrOfLength from "../utils/getStrOfLength";


beforeEach(async () => {
  await User.deleteMany({});
});

export const signUpData: Record<string, any> = {
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
    missingSignUpData("password");

    signUpFieldIsOfLength("firstName", 30);
    signUpFieldIsOfLength("firstName", 29);
    signUpFieldIsOfLength("firstName", 31);
    signUpFieldIsOfLength("firstName", 3);
    signUpFieldIsOfLength("firstName", 2);

    signUpFieldIsOfLength("lastName", 30);
    signUpFieldIsOfLength("lastName", 29);
    signUpFieldIsOfLength("lastName", 31);
    signUpFieldIsOfLength("lastName", 3);
    signUpFieldIsOfLength("lastName", 2);

    signUpFieldIsOfLength("email", 255);
    signUpFieldIsOfLength("email", 6);
    signUpFieldIsOfLength("email", 254);
    signUpFieldIsOfLength("email", 7);
    signUpFieldIsOfLength("email", 8);

    describe("create user with invalid profile path", () => {
      it("returns 400 BadRequest error", async () => {
        const invalidProfilePath = "$hello#";

        await expect(User.create({ ...userDataForModel, profilePath: invalidProfilePath }))
          .rejects.toThrow();
      })
    })

    describe("create user with profilePath that's too long (31 chars)", () => {
      it("throws an error", async () => {
        const profilePath = getStrOfLength(31);
        await expect(User.create({ ...userDataForModel, profilePath }))
          .rejects.toThrow();
      })
    })

    describe("create user with profilePath that's too short (2 chars)", () => {
      it("throws an error", async () => {
        const profilePath = getStrOfLength(2);
        await expect(User.create({ ...userDataForModel, profilePath }))
          .rejects.toThrow();
      })
    })
  })
})
