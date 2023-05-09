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


let authHeader1: string;
let authHeader2: string;
let user1: HydratedDocument<IUser>;
let user2: HydratedDocument<IUser>;

let mongod: MongoMemoryServer;

const jpegImgPath = path.join(__dirname, "../data/avatar.jpeg");


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

    describe("given own auth header (creating post on own wall)", () => {
      describe("given text content", () => {
        it("returns 201 and post and text content", async () => {
          const textContent = "foo bar";

          const { body, statusCode } = await requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .send({ content: textContent })
            .set("Authorization", authHeader1);

          expect(statusCode).toBe(201);
          expect(body.onUser).toBe(user1.id);
          expect(body.createdBy).toBe(user1.id);
          expect(body.tinyPreview).toBe(null);
          expect(body.content).toBe(textContent);
          expect(body.postPath).toMatch(/foo/); // match content excluding the last word. Limited to 70 (may change) characters
          expect(body.views).toBe(0);
          expect(body.likes).toBe(0);
          expect(body.dislikes).toBe(0);
          expect(body.shares).toBe(0);
          expect(body.comments).toEqual([]);
          expect(body.imgs).toEqual([]);
          expect(body.vids).toEqual([]);
        })
      })

      describe("not given anything", () => {
        it("returns 400 bad request", async () => {
          const { body, statusCode } = await requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .set("Authorization", authHeader1);

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(/no content/);
        })
      })

      givenNImgsAndTextContent(1, "this is the content");
      givenNImgsAndTextContent(1, null);

      givenNImgsAndTextContent(10, "this is the content");
      givenNImgsAndTextContent(10, null);

      givenNImgsAndTextContent(11, "this is the content");
      givenNImgsAndTextContent(11, null);
    })
  })
})


function givenNImgsAndTextContent(imgsAmount: number, textContent: string | null) {
  let describeContent = getDescribeContent();
  let itContent = getItContent();

  describe(describeContent, () => {
    it(itContent, async () => {
      const request = requests(app)
        .post(`/users/${user1.profilePath}/posts`)
        .set("Authorization", authHeader1);

      if (textContent) request.field("content", textContent);

      for (let i = 0; i < imgsAmount; i++) {
        request.attach("imgs", jpegImgPath);
      }

      const { body, statusCode } = await request;
      const isLimitExceeded = imgsAmount > imgsUploadLimit;

      if (isLimitExceeded) {
        expect(statusCode).toBe(400);
        const expectRegex = `you've exceeded the limit of ${imgsUploadLimit} images per post`;
        expect(body.message).toMatch(new RegExp(expectRegex));
      } else {
        expect(statusCode).toBe(201);
        expectMetadataToBeZero(body);
        expectPostIsOnCreatorsWall(body, user1);
        if (textContent) {
          expect(body.content).toBe(textContent);
        }
      }
    })
  })

  function getDescribeContent() {
    const wordEnding = imgsAmount > 1 ? "s" : "";
    let content = `given ${imgsAmount} .jpeg image${wordEnding}`;
    if (textContent) content += " and text content";

    return content;
  }

  function getItContent() {
    const wordEnding = imgsAmount > 1 ? "s" : "";
    let content: string;

    if (imgsAmount <= imgsUploadLimit) {
      content = `returns 201 created and img${wordEnding} url${wordEnding}`;
      if (textContent) content += " and textContent";
    } else {
      content = `returns 400 bad request because img limit of ${imgsUploadLimit} was exceeded`;
    }

    return content;
  }
}


function expectPostIsOnCreatorsWall(body: any, user: HydratedDocument<IUser>) {
  expect(body.onUser).toBe(user.id);
  expect(body.createdBy).toBe(user.id);
}


function expectMetadataToBeZero(body: any) {
  const { views, likes, dislikes, shares } = body;
  expect([views, likes, dislikes, shares]).toEqual([0, 0, 0, 0]);
}


async function beforeAllCb() {
  mongod = await dbConnSetup();
  [user1, user2] = await create2Users();
  [authHeader1, authHeader2] = getAuthHeadersFor2Users(user1, user2);
}


async function create2Users() {
  return Promise.all([
    await User.create(getUserDataForModel()),
    await User.create(getUserDataForModel())
  ])
}

function getAuthHeadersFor2Users(user1: HydratedDocument<IUser>, user2: HydratedDocument<IUser>) {
  return [getAuthHeader(user1.id), getAuthHeader(user2.id)]
}

function given1JpegImgAndPossiblyNoTextContent(textContent: string | null) {
  describe(`given 1 .jpeg image and ${textContent ? " " : "no"}text content`, () => {
    it("returns 201 created and image url and tiny preview url", async () => {
      const request = requests(app)
        .post(`/users/${user1.profilePath}/posts`)
        .attach("imgs", jpegImgPath)
        .set("Authorization", authHeader1);
        if (textContent) request.field("content", textContent);

      const { body, statusCode } = await request;

      expect(statusCode).toBe(201);
      expect(body.onUser).toBe(user1.id);
      expect(body.createdBy).toBe(user1.id);
      expect(body.tinyPreview).toMatch(/https:\/\//);
      expect(body.imgs.length).toBe(1);
      expect(body.imgs[0].fullSize).toMatch(/https:\/\//);
      expect(body.imgs[0].feedSize).toMatch(/https:\/\//);
      expect(body.imgs[0].previewSize).toMatch(/https:\/\//);
      if (textContent) {
        expect(body.content).toBe(textContent);
      } else {
        expect(body.content).toBe(null);
      }
      expect(body.comments).toEqual([]);
      expect(body.vids).toEqual([]);
      const { views, likes, dislikes, shares } = body;
      expect([views, likes, dislikes, shares]).toEqual([0, 0, 0, 0]);
    })
  })
}
