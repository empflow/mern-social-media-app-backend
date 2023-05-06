import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import app from "../../app";
import getSignUpData from "../utils/getSignUpData";
import { MongoMemoryServer } from "mongodb-memory-server";
import testMissingSignUpData from "./testMissingSignUpData";
import { getRandomProfilePath } from "../../utils/pathsGenerators";
import convertSignUpDataToSignInData from "../utils/convertSignUpDataToSignInData";
import User from "../../models/User";
import testSignUpFieldIsOfLength from "./testSignUpFieldIsOfLength";
import signUpBeforeEachSignIn from "./signUpBeforeEachSignIn";
import getStrOfLength from "../../utils/getStrOfLength";
import testMissingSignInData from "./testMissingSignInData";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import getUserDataForModel from "../utils/getUserDataForModel";
import path from "node:path";
import getEnvVar from "../../utils/getEnvVar";
import testAvatarUrlsDontMatchDefaultUrls from "./testAvatarUrlsDontMatchDefaultUrls";

// tests seem to be running twice or more
// weird behavior, but couldn't fix
// seems like it doesn't affect anything but the amount of tests run in the report

export const signUpData = getSignUpData();
export const signInData = convertSignUpDataToSignInData(signUpData);
const defaultAvatarUrl400px = getEnvVar("DEFAULT_AVATAR_URL_400_PX");
const defaultAvatarUrl200px = getEnvVar("DEFAULT_AVATAR_URL_200_PX");
const defaultAvatarUrl100px = getEnvVar("DEFAULT_AVATAR_URL_100_PX");

export const userDataForModel = getUserDataForModel();

describe("auth", () => {
  let mongod: MongoMemoryServer;
  
  beforeAll(async () => mongod = await dbConnSetup());
  afterEach(async () => User.deleteMany({}));
  afterAll(async () => await dbConnTeardown(mongod));
  
  describe("sign-up", () => {
    describe("given all correct sign-up data", () => {
      describe("no avatar attached", () => {
        it("returns 201 created user and token (no password)", async () => {
          const { body, statusCode } = await requests(app)
            .post("/auth/sign-up")
            .send(signUpData);
    
            expect(statusCode).toBe(201);
            expect(body.user).toBeDefined();
            expect(body.token).toBeDefined();
            expect(body.password).toBeUndefined();
            expect(body.user.avatarUrl400px).toBe(defaultAvatarUrl400px);
            expect(body.user.avatarUrl200px).toBe(defaultAvatarUrl200px);
            expect(body.user.avatarUrl100px).toBe(defaultAvatarUrl100px);
        })
      })
    
      describe("given an attached heic avatar", () => {
        it("returns 400 bad request because file ext is unsupported", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.heic");

          const { body, statusCode } = await requests(app)
            .post("/auth/sign-up")
            .field("firstName", signUpData.firstName)
            .field("lastName", signUpData.lastName)
            .field("email", signUpData.email)
            .field("password", signUpData.password)
            .attach("avatar", imgPath);

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(/Forbidden file extension/);
        })
      })

      describe("given an attached jpeg avatar", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");

          const { body, statusCode } = await requests(app)
            .post("/auth/sign-up")
            .field("firstName", signUpData.firstName)
            .field("lastName", signUpData.lastName)
            .field("email", signUpData.email)
            .field("password", signUpData.password)
            .attach("avatar", imgPath);

          console.log(body);
          const { user } = body;
          expect(statusCode).toBe(201);
          testAvatarUrlsDontMatchDefaultUrls(user);
        })
      })

      describe("given an avatar in an unexpected field", () => {
        it("returns 400 bad request", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpg")
    
          const { body, statusCode } = await requests(app)
            .post("/auth/sign-up")
            .field("firstName", signUpData.firstName)
            .field("lastName", signUpData.lastName)
            .field("email", signUpData.email)
            .field("password", signUpData.password)
            .attach("foo", imgPath);
    
          expect(statusCode).toBe(400);
          expect(body.message).toBe("Unexpected field");
        })
      })
    })



    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);
        
        const signUpData = { ...userDataForModel, profilePath: undefined };
        const { body, statusCode } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        expect(body.message).toBeDefined();
        expect(statusCode).toBe(409);
      })
    })

    describe("given profilePath", () => {
      it("ignores it and returns 201 and a user with a random profilePath", async () => {
        const profilePath = "foobar";

        const { body, statusCode } = await requests(app)
          .post("/auth/sign-up")
          .send({ ...signUpData, profilePath });

        expect(body.profilePath).not.toBe(profilePath);
        expect(statusCode).toBe(201);
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

    testSignUpFieldIsOfLength("email", 254);
    testSignUpFieldIsOfLength("email", 253);
    testSignUpFieldIsOfLength("email", 255);
    testSignUpFieldIsOfLength("email", 7);
    testSignUpFieldIsOfLength("email", 6);

    testSignUpFieldIsOfLength("password", 100);
    testSignUpFieldIsOfLength("password", 99);
    testSignUpFieldIsOfLength("password", 101);
    testSignUpFieldIsOfLength("password", 10);
    testSignUpFieldIsOfLength("password", 9);

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
    beforeEach(signUpBeforeEachSignIn);

    describe("given all correct sign-in data", () => {
      it("returns 200 and token", async () => {
        const { body, statusCode } = await requests(app)
          .post("/auth/sign-in")
          .send(signInData)

        expect(statusCode).toBe(200);
        expect(body.token).toBeDefined();
        expect(body.user).toBeDefined();
        expect(body.user._id).toBeDefined();
        expect(body.user.profilePath).toBeDefined();
      })
    })

    describe("user doesn't exist (no user with such email)", () => {
      it("returns 404 not found", async () => {
        const { body, statusCode } = await requests(app)
          .post("/auth/sign-in")
          .send({ ...signInData, email: "thisDoesntExist@gmail.com" });

        expect(statusCode).toBe(404);
        expect(body.message).toBe("user not found");
      })
    })

    describe("wrong password", () => {
      it("returns 401 unauthorized", async () => {
        const { body, statusCode } = await requests(app)
          .post("/auth/sign-in")
          .send({ ...signInData, password: "wrong-password" });

        expect(body.message).toBe("wrong password");
        expect(statusCode).toBe(401);
      })
    })

    testMissingSignInData("email");
    testMissingSignInData("password");
  })
})
