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
import path from "path";
import getEnvVar from "../../utils/getEnvVar";
import test from "./test";
import Post, { IPost } from "../../models/Post";

let mongod: MongoMemoryServer;

let user1: HydratedDocument<IUser>;
let user2: HydratedDocument<IUser>;
let user1AuthHeader: string;
let user2AuthHeader: string;
let postByUser1: HydratedDocument<IPost>;

describe("comments", () => {
  describe("add comment", () => {
    describe("not given an auth header", () => {
      it("returns 401 unauthorized", async () => {
        const { statusCode, body } = await requests(app)
          .post(`/posts/${postByUser1.postPath}/comments`)
          .send({ content: "foo" });
        
        expect(statusCode).toBe(401);
        expect(body.message).toMatch(/unauthorized/);
      })
    })
  })

  beforeAll(async () => {
    mongod = await dbConnSetup();
    [user1, user2] = await createNUsers(2);
    [user1AuthHeader, user2AuthHeader] = getAuthHeadersForUsers(user1, user2);
  });
  beforeEach(async () => {
    const { body } = await requests(app)
      .post(`/users/${user1.profilePath}/posts`)
      .send({ content: "hi" })
      .set("Authorization", user1AuthHeader);
    postByUser1 = JSON.parse(JSON.stringify(body));
  });
  afterAll(async () => await dbConnTeardown(mongod));
})
