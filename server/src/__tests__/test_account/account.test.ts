import dotenv from "dotenv";
dotenv.config();
import { HydratedDocument } from "mongoose"
import User, { IUser } from "../../models/User"
import createNUsers from "../utils/createNUsers";
import requests from "supertest";
import app from "../../app";
import getAuthHeadersForUsers from "../utils/getAuthHeadersForUsers";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";

let mongod: MongoMemoryServer;

let user1: HydratedDocument<IUser>;
let user2: HydratedDocument<IUser>;
let user1AuthHeader: string;
let user2AuthHeader: string;

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
      it("returns 406 conflict", async () => {
        const { body, statusCode } = await requests(app)
          .patch("/account")
          .send({ profilePath: user1.profilePath })
          .set("Authorization", user1AuthHeader);

          expect(statusCode).toBe(409);
          expect(body.message).toMatch(/profile path unavailable/);
      })
    })
  })

  beforeAll(async () => mongod = await dbConnSetup());
  beforeEach(async () => {
    [user1, user2] = await createNUsers(2);
    [user1AuthHeader, user2AuthHeader] = getAuthHeadersForUsers(user1, user2);
  });
  afterAll(async () => await dbConnTeardown(mongod));
})
