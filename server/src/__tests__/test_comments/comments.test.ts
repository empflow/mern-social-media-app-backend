import dotenv from "dotenv";
dotenv.config();
import mongoose, { HydratedDocument } from "mongoose"
import { IUser } from "../../models/User"
import createNUsers from "../utils/createNUsers";
import requests from "supertest";
import app from "../../app";
import getAuthHeadersForUsers from "../utils/getAuthHeadersForUsers";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import path from "path";
import { IPost } from "../../models/Post";
import addComment from "./addComment";
import addCommentGiven from "./addCommentGiven";
import patchComment from "./patchComment";
import Comment from "../../models/Comment";

let mongod: MongoMemoryServer;

let user1: IUser;
let user2: IUser;
export let user1AuthHeader: string;
export let user2AuthHeader: string;
export let postByUser1: IPost;

const content = "foo bar";


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

    describe("given user 1 auth header", () => {
      describe("given text content", () => {
        it("returns 201 created", async () => {
          const { statusCode, body } = await requests(app)
            .post(`/posts/${postByUser1.postPath}/comments`)
            .send({ content })
            .set("Authorization", user1AuthHeader);

          expect(statusCode).toBe(201);
          expect(body.createdBy).toBe(user1.id);
          expect(body.content).toBe(content);
          expect(body.onPost).toBe(postByUser1.postPath);
          expect([body.likes, body.dislikes]).toEqual([0, 0]);
          expect(body.replyTo).toBe(null);
          expect([body.imgs, body.vids]).toEqual([[], []]);
          expect(body.createdAt).toBeDefined();
          expect(body.updatedAt).toBe(body.createdAt);
        })
      })

      describe("given reply to comment (which exists) & text content", () => {
        it("returns 201 & comment & reply to", async () => {
          // const { body: body1 } = await requests(app).post(`/posts/${postByUser1.postPath}/comments`).send({ content: "foo" })
          const { body: comm1, statusCode: statusCodeComm1 } = await addComment({ content: "foo" });
          const { body: comm2, statusCode: statusCodeComm2 } = await addComment({ content: "bar", replyTo: comm1._id });

          expect(statusCodeComm1).toBe(201);
          expect(statusCodeComm2).toBe(201);
          expect(comm1.onPost).toBe(postByUser1.postPath);
          expect(comm1.replyTo).toBe(null);
          expect(comm2.onPost).toBe(postByUser1.postPath);
          expect(comm2.replyTo).toBe(comm1._id);
        })
      })

      const jpegImgPath = path.join(__dirname, "../data/avatar.jpeg");
      const jpgImgPath = path.join(__dirname, "../data/avatar.jpg");
      const pngImgPath = path.join(__dirname, "../data/avatar.png");
      const webpImgPath = path.join(__dirname, "../data/avatar.webp");
      const svgImgPath = path.join(__dirname, "../data/avatar.svg");
      const textFilePath = path.join(__dirname, "../data/file.txt");

      addCommentGiven({ imgPath: jpegImgPath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: pngImgPath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: webpImgPath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: svgImgPath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: textFilePath, imgsAmount: 1, content });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 10, content });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 11, content });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 0, content });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 1, content: null });
      addCommentGiven({ imgPath: jpgImgPath, imgsAmount: 0, content: null });
    })
  })

  describe("patch comment", () => {
    describe("not given auth header", () => {
      it("returns 401 unauthorized", async () => {
        const initComment = await addComment({ content });
        const { statusCode, body } = await requests(app)
          .patch(`/comments/${initComment.body._id}`);

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
