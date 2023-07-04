import dotenv from "dotenv";
dotenv.config();
import { IUser } from "../../models/User"
import createNUsers from "../utils/createNUsers";
import requests from "supertest";
import app from "../../app";
import getAuthHeadersForUsers from "../utils/getAuthHeadersForUsers";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import path from "path";
import getEnvVar from "../../utils/getEnvVar";

let mongod: MongoMemoryServer;

let user1: IUser;
let user2: IUser;
let user1AuthHeader: string;
let user2AuthHeader: string;

const defaultAvatarUrl400px = getEnvVar("DEFAULT_AVATAR_URL_400_PX");
const defaultAvatarUrl200px = getEnvVar("DEFAULT_AVATAR_URL_200_PX");
const defaultAvatarUrl100px = getEnvVar("DEFAULT_AVATAR_URL_100_PX");


describe("account", () => {
  describe("patch account", () => {
    describe("not given an auth header", () => {
      it("retuns 401 unauthorized", async () => {
        const { body, statusCode } = await requests(app)
          .patch("/account");
        
        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })

    describe("given an already used profile path", () => {
      it("returns 409 conflict", async () => {
        const { body, statusCode } = await requests(app)
          .patch("/account")
          .send({ profilePath: user1.profilePath })
          .set("Authorization", user1AuthHeader);

          expect(statusCode).toBe(409);
          expect(body.message).toMatch(/profile path unavailable/);
      })
    })
  })


  describe(`given a .jpeg avatar`, () => {
    it("returns 200 and avatar urls", async () => {
      const avatarPath = path.join(__dirname, "../data/avatar.jpeg");
      const { body, statusCode } = await requests(app)
        .patch("/account")
        .set("Authorization", user1AuthHeader)
        .attach("avatar", avatarPath);
    
      expect(statusCode).toBe(200);
      expect(body.avatarUrl400px).not.toBe(defaultAvatarUrl400px);
      expect(body.avatarUrl200px).not.toBe(defaultAvatarUrl200px);
      expect(body.avatarUrl100px).not.toBe(defaultAvatarUrl100px);
    })
  })

  describe(`given a .jpg avatar`, () => {
    it("returns 200 and avatar urls", async () => {
      const avatarPath = path.join(__dirname, "../data/avatar.jpg");
      const { body, statusCode } = await requests(app)
        .patch("/account")
        .set("Authorization", user1AuthHeader)
        .attach("avatar", avatarPath);
    
      expect(statusCode).toBe(200);
      expect(body.avatarUrl400px).not.toBe(defaultAvatarUrl400px);
      expect(body.avatarUrl200px).not.toBe(defaultAvatarUrl200px);
      expect(body.avatarUrl100px).not.toBe(defaultAvatarUrl100px);
    })
  })

  describe(`given a .png avatar`, () => {
    it("returns 200 and avatar urls", async () => {
      const avatarPath = path.join(__dirname, "../data/avatar.png");
      const { body, statusCode } = await requests(app)
        .patch("/account")
        .set("Authorization", user1AuthHeader)
        .attach("avatar", avatarPath);
    
      expect(statusCode).toBe(200);
      expect(body.avatarUrl400px).not.toBe(defaultAvatarUrl400px);
      expect(body.avatarUrl200px).not.toBe(defaultAvatarUrl200px);
      expect(body.avatarUrl100px).not.toBe(defaultAvatarUrl100px);
    })
  })

  describe(`given a .svg avatar`, () => {
    it("returns 400 bad request", async () => {
      const avatarPath = path.join(__dirname, "../data/avatar.svg");
      const { body, statusCode } = await requests(app)
        .patch("/account")
        .set("Authorization", user1AuthHeader)
        .attach("avatar", avatarPath);
    
      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/Forbidden file extension/);
    })
  })

  describe("given an avatar in an unexpected field", () => {
    it("returns 400 bad request", async () => {
      const avatarPath = path.join(__dirname, "../data/avatar.jpeg");
      const { body, statusCode } = await requests(app)
        .patch("/account")
        .set("Authorization", user1AuthHeader)
        .attach("foo", avatarPath);

      expect(statusCode).toBe(400);
      expect(body.message).toMatch(/Unexpected field/);
    })
  })

  beforeAll(async () => mongod = await dbConnSetup());
  beforeEach(async () => {
    [user1, user2] = await createNUsers(2);
    [user1AuthHeader, user2AuthHeader] = getAuthHeadersForUsers(user1, user2);
  });
  afterAll(async () => await dbConnTeardown(mongod));
})
