import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import app from "../../app";
import getAuthHeader from "../utils/getAuthHeader";
import Post, { IPost } from "../../models/Post";
import { imgsUploadLimit, vidsUploadLimit } from "../../utils/s3";
import User, { IUser } from "../../models/User";
import getUserDataForModel from "../utils/getUserDataForModel";
import { HydratedDocument } from "mongoose";
import path from "node:path";
import { IPostImgUploadResult } from "../../utils/optimizeAndUploadPostImgs";
import expectImgsUrlsMatchHttps from "../utils/expectImgsUrlsMatchHttps";
import givenNImgsAndTextContent from "./givenNImgsAndTextContent/givenNImgsAndTextContent";
import expectMetadataToBeZero from "./expectMetadataToBeZero";
import attachNFiles from "../utils/attachNImgs";
import createNUsers from "../utils/createNUsers";
import getAuthHeadersForUsers from "../utils/getAuthHeadersForUsers";
import { getFileCountExceedsLimitMsg } from "../../config/multer";
import { getPostPath } from "../../utils/pathsGenerators";
import expectDates from "../utils/expectDates";
import { jpegImgPath } from "../utils/imgsPaths";


export let user1: IUser;
export let user2: IUser;
export let userWithRestrictedPosting: IUser;
export let user1AuthHeader: string;
export let user2AuthHeader: string;
export let userWithRestrictedPostingAuthHeader: string;
let postByUser1: IPost;
let postByUser2: IPost;

let mongod: MongoMemoryServer;
const imgsLimitExceededMsgMatch = getFileCountExceedsLimitMsg(imgsUploadLimit);
const content = "foo bar";


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

    const textContent = "this is the content";
    describe("creating post on own wall", () => {
      givenNImgsAndTextContent(0, null);
      
      givenNImgsAndTextContent(0, textContent);

      givenNImgsAndTextContent(1, textContent);
      givenNImgsAndTextContent(1, null);

      givenNImgsAndTextContent(10, textContent);
      givenNImgsAndTextContent(10, null);

      givenNImgsAndTextContent(11, textContent);
      givenNImgsAndTextContent(11, null);
    })

    describe("creating post on someone else's wall", () => {
      describe("posting on user who allows others to post (no images)", () => {
        it("returns 201 created", async () => {
          const { body, statusCode } = await requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent);

          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(user2.id);
          expect(body.onUser).toBe(user1.id);
          expect([body.imgs, body.vids]).toEqual([[], []]);
        })
      })

      describe("posting on user who allows others to post (with 1 image)", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 1;
          const request = requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(201);
          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(user2.id);
          expect(body.onUser).toBe(user1.id);
          expect(body.vids).toEqual([]);
          expect(body.imgs.length).toBe(imgsAmount);
          expectImgsUrlsMatchHttps(body);
        })
      })

      describe("posting on user who allows others to post (with 10 images)", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 10;
          const request = requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(201);
          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(user2.id);
          expect(body.onUser).toBe(user1.id);
          expect(body.vids).toEqual([]);
          expect(body.imgs.length).toBe(imgsAmount);
          expectImgsUrlsMatchHttps(body);
        }, 10000)
      })

      describe("posting on user who allows others to post (with 11 images)", () => {
        it("returns 400 bad request", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 11;
          const request = requests(app)
            .post(`/users/${user1.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(imgsLimitExceededMsgMatch);
        }, 10000)
      })

      describe("posting on user who does not allow others to post (no images)", () => {
        it("returns 403 forbidden", async () => {
          const { body, statusCode } = await requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)

          expect(statusCode).toBe(403);
          expect(body.message).toMatch(/posting to this user's wall is not allowed/);
        }, 10000)
      })

      describe("posting on user who does not allow others to post (with 1 image)", () => {
        it("returns 403 forbidden", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 1;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(403);
          expect(body.message).toMatch(/posting to this user's wall is not allowed/);
        }, 10000)
      })

      describe("posting on user who does not allow others to post (with 10 images)", () => {
        it("returns 403 forbidden", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 10;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(403);
          expect(body.message).toMatch(/posting to this user's wall is not allowed/);
        }, 10000)
      })

      describe("posting on user who does not allow others to post (with 11 images)", () => {
        it("returns 403 forbidden", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 11;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", user2AuthHeader)
            .field("content", textContent)
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(new RegExp(imgsLimitExceededMsgMatch));
        }, 10000)
      })

      // i don't think i should check that it's handling the images as expected so many fucking times
      describe("posting on own wall when others aren't allowed to post (no images)", () => {
        it("returns 201 created", async () => {
          const { body, statusCode } = await requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", userWithRestrictedPostingAuthHeader)
            .field("content", textContent)

          expect(statusCode).toBe(201);
          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(userWithRestrictedPosting.id);
          expect(body.onUser).toBe(userWithRestrictedPosting.id);
          expect([body.imgs, body.vids]).toEqual([[], []]);
        }, 10000)
      })

      describe("posting on own wall when others aren't allowed to post (1 image)", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 1;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", userWithRestrictedPostingAuthHeader)
            .field("content", textContent);
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(201);
          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(userWithRestrictedPosting.id);
          expect(body.onUser).toBe(userWithRestrictedPosting.id);
          expect(body.vids).toEqual([]);
          expect(body.imgs.length).toBe(imgsAmount);
          expectImgsUrlsMatchHttps(body);
        }, 10000)
      })

      describe("posting on own wall when others aren't allowed to post (10 images)", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 10;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", userWithRestrictedPostingAuthHeader)
            .field("content", textContent);
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(201);
          expectMetadataToBeZero(body);
          expect(body.createdBy).toBe(userWithRestrictedPosting.id);
          expect(body.onUser).toBe(userWithRestrictedPosting.id);
          expect(body.vids).toEqual([]);
          expect(body.imgs.length).toBe(imgsAmount);
          expectImgsUrlsMatchHttps(body);
        }, 10000)
      })

      describe("posting on own wall when others aren't allowed to post (11 images)", () => {
        it("returns 201 created", async () => {
          const imgPath = path.join(__dirname, "../data/avatar.jpeg");
          const imgsAmount = 11;
          const request = requests(app)
            .post(`/users/${userWithRestrictedPosting.profilePath}/posts`)
            .set("Authorization", userWithRestrictedPostingAuthHeader)
            .field("content", textContent);
          attachNFiles("imgs", imgPath, imgsAmount, request);
          const { body, statusCode } = await request;

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(new RegExp(imgsLimitExceededMsgMatch));
        }, 10000)
      })
    })
  })


  describe("patch post", () => {
    beforeEach(async () => {
      const content = "foo bar";
      postByUser1 = await Post.create({ onUser: user1.id, createdBy: user1.id, postPath: getPostPath(content) });
      postByUser2 = await Post.create({ onUser: user2.id, createdBy: user2.id, postPath: getPostPath(content) });
    })

    describe("not given auth header", () => {
      it("returns 401 unauthorized", async () => {
        const { body, statusCode } = await requests(app)
          .patch(`/posts/${postByUser1.postPath}`)
          .send({ content: "new content" });

        expect(statusCode).toBe(401);
        expect(body.message).toMatch("unauthorized");
      })
    })

    describe("given auth header", () => {
      describe("given content", () => {
        it("returns 200 and post with updated content", async () => {
          const { body, statusCode } = await requests(app)
            .patch(`/posts/${postByUser1.postPath}`)
            .send({ content })
            .set("Authorization", user1AuthHeader);

          const {
            content: returnedContent, onUser, createdBy, tinyPreview, imgs, comments, vids, createdAt, updatedAt, likes, dislikes, shares, views
          } = body;

          expect(statusCode).toBe(200);
          expect(returnedContent).toBe(content);
          expect(onUser).toBe(postByUser1.onUser.toString());
          expect(createdBy).toBe(postByUser1.createdBy.toString());
          expect(tinyPreview).toBe(postByUser1.tinyPreview);
          expect(imgs).toEqual(postByUser1.imgs);
          expect(comments).toEqual(postByUser1.comments);
          expect(vids).toEqual(postByUser1.vids);
          expect(likes).toBe(postByUser1.likes);
          expect(dislikes).toBe(postByUser1.dislikes);
          expect(shares).toBe(postByUser1.shares);
          expect(views).toBe(postByUser1.views);
          expectDates(createdAt, postByUser1.createdAt).toBeEqual();
          expectDates(updatedAt, postByUser1.updatedAt).notToBeEqual();
        })
      })

      describe("given nothing", () => {
        it("returns 200 and same post", async () => {
          const { statusCode, body } = await requests(app)
            .patch(`/posts/${postByUser1.postPath}`)
            .set("Authorization", user1AuthHeader);

          const {
            content, onUser, createdBy, tinyPreview, imgs, comments, vids, createdAt, updatedAt, likes, dislikes, shares, views
          } = body;
          expect(statusCode).toBe(200);
          expect(content).toBe(postByUser1.content);
          expect(onUser).toBe(postByUser1.onUser.toString());
          expect(createdBy).toBe(postByUser1.createdBy.toString());
          expect(tinyPreview).toBe(postByUser1.tinyPreview);
          expect(imgs).toEqual(postByUser1.imgs);
          expect(comments).toEqual(postByUser1.comments);
          expect(vids).toEqual(postByUser1.vids);
          expectDates(createdAt, postByUser1.createdAt).toBeEqual();
          expectDates(updatedAt, postByUser1.updatedAt).notToBeEqual();
          expect(likes).toEqual(postByUser1.likes);
          expect(dislikes).toEqual(postByUser1.dislikes);
          expect(shares).toEqual(postByUser1.shares);
          expect(views).toEqual(postByUser1.views);
        })
      })

      describe("given 1 .jpeg img", () => {
        it("returns 200 & post with 1 img in imgs array", async () => {
          const { statusCode, body } = await requests(app)
            .patch(`/posts/${postByUser1.postPath}`)
            .attach("imgs", jpegImgPath)
            .set("Authorization", user1AuthHeader);

          expect(statusCode).toBe(200);
          expect(body.imgs.length).toBe(1);
          expectImgsUrlsMatchHttps(body);
          expect(body.imgs[0]?._id).toBeDefined();
        })
      })

      describe("given 11 .jpeg imgs", () => {
        it("returns 400 bad request", async () => {
          const req = requests(app)
            .patch(`/posts/${postByUser1.postPath}`)
            .set("Authorization", user1AuthHeader);
          const { statusCode, body } = await attachNFiles("imgs", jpegImgPath, 11, req);
          
          expect(statusCode).toBe(400);
          const msgToExpect = getFileCountExceedsLimitMsg(imgsUploadLimit);
          expect(body.message).toBe(msgToExpect);
        }, 10000)
      })

      describe("given .jpeg img in an unexpected field", () => {
        it("returns 400 bad request", async () => {
          const { statusCode, body } = await requests(app)
            .patch(`/posts/${postByUser1.postPath}`)
            .attach("foo", jpegImgPath)
            .set("Authorization", user1AuthHeader);

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(/unexpected field/i);
        })
      })
    })
  })
  // TODO: test when trying to patch someone else's post
})


async function beforeAllCb() {
  mongod = await dbConnSetup();
  
  [user1, user2] = await createNUsers(2);
  [userWithRestrictedPosting] = await createNUsers(1, { canAnyonePost: false });
  [
    user1AuthHeader, user2AuthHeader, userWithRestrictedPostingAuthHeader
  ] = getAuthHeadersForUsers(user1, user2, userWithRestrictedPosting);
}
