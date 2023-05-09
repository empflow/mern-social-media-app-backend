import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import app from "../../app";
import getAuthHeader from "../utils/getToken";
import Post from "../../models/Post";
import { imgsUploadLimit, vidsUploadLimit } from "../../utils/s3";
import User, { IUser } from "../../models/User";
import getUserDataForModel from "../utils/getUserDataForModel";
import { HydratedDocument } from "mongoose";
import path from "node:path";
import { IImgUploadResult } from "../../utils/optimizeAndUploadPostImgs";
import expectImgsUrlsMatchHttps from "./expectImgsUrlsMatchHttps";
import givenNImgsAndTextContent from "./givenNImgsAndTextContent/givenNImgsAndTextContent";


export let authHeader1: string;
export let authHeader2: string;
export let user1: HydratedDocument<IUser>;
export let user2: HydratedDocument<IUser>;
export let userWithRestrictedPosting: HydratedDocument<IUser>;

let mongod: MongoMemoryServer;

export const jpegImgPath = path.join(__dirname, "../data/avatar.jpeg");


describe("posts", () => {
  beforeAll(beforeAllCb);
  afterEach(async () => await Post.deleteMany({}));
  afterAll(async () => await dbConnTeardown(mongod));

  describe("add post", () => {
    describe("not given auth header", () => {
      it("returns 401 unauthorized", async () => {
        const { body, statusCode } = await requests(app)
          .post("/users/profilePath/posts")
          .send({ content: "post content" });

        expect(body.message).toMatch(/unauthorized/i);
        expect(statusCode).toBe(401);
      })
    });

    const content = "this is the content";
    describe("given own auth header (creating post on own wall)", () => {
      givenNImgsAndTextContent(0, null);
      
      givenNImgsAndTextContent(0, content);

      givenNImgsAndTextContent(1, content);
      givenNImgsAndTextContent(1, null);

      givenNImgsAndTextContent(10, content);
      givenNImgsAndTextContent(10, null);

      givenNImgsAndTextContent(11, content);
      givenNImgsAndTextContent(11, null);
    })
  })

  // TODO: write the rest of the tests
})


async function beforeAllCb() {
  mongod = await dbConnSetup();
  
  [user1, user2] = await createNUsers(2);
  [userWithRestrictedPosting] = await createNUsers(1, { canAnyonePost: false });
  [authHeader1, authHeader2] = getAuthHeadersForUsers(user1, user2);
}


async function createNUsers(
  amount: number,
  customModelData: Partial<IUser> = {}
) {
  const promises = [];
  for (let i = 0; i < amount; i++) {
    promises.push(User.create({ ...getUserDataForModel(), ...customModelData }));
  }

  return Promise.all(promises);
}


function getAuthHeadersForUsers(...users: HydratedDocument<IUser>[]) {
  return users.map(user => getAuthHeader(user.id));
}
