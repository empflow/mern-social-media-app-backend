import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import app from "../../app";
import getSignUpData from "../utils/getSignUpData";
import { MongoMemoryServer } from "mongodb-memory-server";
import testMissingSignUpData from "./testMissingSignUpData";
import { getRandomProfilePath } from "../../utils/pathsGenerators";
import convertSignUpDataToSignInData from "../utils/convertSignUpDataToSignInData";
import assertJson from "../utils/assertJson";
import User from "../../models/User";
import testSignUpFieldIsOfLength from "./testSignUpFieldIsOfLength";
import signUpBeforeEachSignInAndAssertJson from "./signUpBeforeEachSignInAndAssertJson";
import getStrOfLength from "../../utils/getStrOfLength";
import testMissingSignInData from "./testMissingSignInData";
import { dbConnSetup, dbConnTeardown } from "../utils/db";

// tests seem to be running twice or more
// weird behavior, but couldn't fix
// seems like it doesn't affect anything but the amount of tests run in the report

export const signUpData = getSignUpData();
export const signInData = convertSignUpDataToSignInData(signUpData);

export const userDataForModel = {
  ...signUpData,
  profilePath: getRandomProfilePath()
}

describe("auth", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => mongod = await dbConnSetup());
  afterEach(async () => User.deleteMany({}));
  afterAll(async () => await dbConnTeardown(mongod));

  describe("sign-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns 201 created user and token (no password)", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

          assertJson(headers);
          expect(statusCode).toBe(201);
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
          expect(body.password).toBeUndefined();
      })
    })

    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);
        
        const signUpData = { ...userDataForModel, profilePath: undefined };
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        assertJson(headers);
        expect(body.message).toBeDefined();
        expect(statusCode).toBe(409);
      })
    })

    testMissingSignUpData("firstName");
    testMissingSignUpData("lastName");
    testMissingSignUpData("email");
    testMissingSignUpData("password");

    testSignUpFieldIsOfLength("firstName", 30);
    testSignUpFieldIsOfLength("firstName", 29);
    testSignUpFieldIsOfLength("firstName", 31);
    testSignUpFieldIsOfLength("firstName", 3);
    testSignUpFieldIsOfLength("firstName", 2);

    testSignUpFieldIsOfLength("lastName", 30);
    testSignUpFieldIsOfLength("lastName", 29);
    testSignUpFieldIsOfLength("lastName", 31);
    testSignUpFieldIsOfLength("lastName", 3);
    testSignUpFieldIsOfLength("lastName", 2);

    testSignUpFieldIsOfLength("email", 255);
    testSignUpFieldIsOfLength("email", 6);
    testSignUpFieldIsOfLength("email", 254);
    testSignUpFieldIsOfLength("email", 7);
    testSignUpFieldIsOfLength("email", 8);

    testSignUpFieldIsOfLength("password", 9);
    testSignUpFieldIsOfLength("password", 101);
    testSignUpFieldIsOfLength("password", 10);
    testSignUpFieldIsOfLength("password", 100);
    testSignUpFieldIsOfLength("password", 50);

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

  describe("sign-in", () => {
    beforeEach(signUpBeforeEachSignInAndAssertJson);

    describe("given all correct sign-in data", () => {
      it("returns 200 and token", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-in")
          .send(signInData)

        assertJson(headers);
        expect(statusCode).toBe(200);
        expect(body.token).toBeDefined();
        expect(body.user).toBeDefined();
        expect(body.user._id).toBeDefined();
        expect(body.user.profilePath).toBeDefined();
      })
    })

    describe("user doesn't exist (no user with such email)", () => {
      it("returns 404 not found", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-in")
          .send({ ...signInData, email: "thisDoesntExist@gmail.com" });

        assertJson(headers);
        expect(statusCode).toBe(404);
        expect(body.message).toBe("user not found");
      })
    })

    describe("wrong password", () => {
      it("returns 401 unauthorized", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-in")
          .send({ ...signInData, password: "wrong-password" });

        assertJson(headers);
        expect(body.message).toBe("wrong password");
        expect(statusCode).toBe(401);
      })
    })

    testMissingSignInData("email");
    testMissingSignInData("password");
  })
})
