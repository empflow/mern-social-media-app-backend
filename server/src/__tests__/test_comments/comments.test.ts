import dotenv from "dotenv";
dotenv.config();
import { IUser } from "../../models/User"
import createNUsers from "../utils/createNUsers";
import requests from "supertest";
import app from "../../app";
import getAuthHeadersForUsers from "../utils/getAuthHeadersForUsers";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import { IPost } from "../../models/Post";
import addComment from "./addComment";
import testAddCommentGiven from "./testAddCommentGiven";
import patchComment from "./patchComment";
import Comment, { IComment } from "../../models/Comment";
import { jpgImgPath, pngImgPath, svgImgPath, textFilePath, webpImgPath, jpegImgPath } from "../utils/imgsPaths";
import getInitCommentImgObjects from "./getInitCommentImgObjects";
import attachNFiles from "../utils/attachNImgs";
import { imgsUploadLimit } from "../../utils/s3";
import { getFileCountExceedsLimitMsg } from "../../config/multer";

let mongod: MongoMemoryServer;

let user1: IUser;
let user2: IUser;
let commToPatch: IComment;
let replyToComm: IComment;
let commWith2Imgs: IComment;

export let user1AuthHeader: string;
export let user2AuthHeader: string;
export let postByUser1: IPost;

const content = "foo bar";
const imgsObjsIds = getInitCommentImgObjects(10).map(obj => obj._id);


describe("comments", () => {
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

    const imgObjs = getInitCommentImgObjects(2);
    postByUser1 = JSON.parse(JSON.stringify(body));
    commToPatch = await Comment.create({ onPost: postByUser1._id, createdBy: user1.id });
    replyToComm = await Comment.create({ onPost: postByUser1._id, createdBy: user1.id });
    commWith2Imgs = await Comment.create({
      onPost: postByUser1._id, createdBy: user1.id, imgs: imgObjs
    });
  });
  afterAll(async () => await dbConnTeardown(mongod));

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

      testAddCommentGiven({ imgPath: jpegImgPath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: pngImgPath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: webpImgPath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: svgImgPath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: textFilePath, imgsAmount: 1, content });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 10, content });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 11, content });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 0, content });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 1, content: null });
      testAddCommentGiven({ imgPath: jpgImgPath, imgsAmount: 0, content: null });
    })
  })

  describe("patch comment", () => {
    describe("not given auth header", () => {
      it("returns 401 unauthorized", async () => {
        const { body: initComment } = await addComment({ content });
        const { statusCode, body } = await requests(app)
          .patch(`/comments/${initComment._id}`);

        expect(statusCode).toBe(401);
        expect(body.message).toMatch(/unauthorized/);
      })
    })
    
    describe("given content", () => {
      it("returns comment with updated content", async () => {
        await patchComment({ comment: commToPatch, content: "foo bar" });
      })
    })

    describe("given content and valid reply to", () => {
      it("returns comment with updated content and replyTo", async () => {
        await patchComment({ comment: commToPatch, content: "foo bar", replyTo: replyToComm.id });
      })
    })

    describe("given content and invalid replyTo", () => {
      it("returns 400 bad request", async () => {
        await patchComment({ comment: commToPatch, content: "foo bar", replyTo: "doesnotexist" });
      })
    })

    describe("given 2 new imgs and content", () => {
      it("returns comment with 2 new imgs and content", async () => {
        await patchComment({ comment: commToPatch, content: "foo bar", newImgs: { path: jpegImgPath, amount: 2 } });
      })
    })

    describe("given 11 new imgs and content", () => {
      it("returns 400 bad request", async () => {
        await patchComment({ comment: commToPatch, content: "foo bar", newImgs: { path: jpegImgPath, amount: 2 } });
      })
    })
    
    describe("given init comment has 2 imgs and given 2 valid img ids to delete", () => {
      it("returns 200 and comment with no imgs", async () => {
         const { body, statusCode } = await requests(app)
          .patch(`/comments/${commWith2Imgs.id}`)
          .send({
            filesToDeleteIds: [imgsObjsIds[0], imgsObjsIds[1]]
          })
          .set("Authorization", user1AuthHeader);

        expect(statusCode).toBe(200);
        expect(body.imgs.length).toBe(0);
      })
    })

    describe("given init comment has 2 imgs and given 2 new imgs", () => {
      it("returns 200 and comment with 4 imgs", async () => {
         const { body, statusCode } = await requests(app)
          .patch(`/comments/${commWith2Imgs.id}`)
          .attach("imgs", pngImgPath)
          .attach("imgs", pngImgPath)
          .set("Authorization", user1AuthHeader);

        expect(statusCode).toBe(200);
        expect(body.imgs.length).toBe(4);
      })
    })

    describe("given init commment has no imgs and given 2 img ids to delete", () => {
      it("retuns 400 bad request", async () => {
        const { body, statusCode } = await requests(app)
          .patch(`/comments/${commToPatch.id}`)
          .send({ filesToDeleteIds: [imgsObjsIds[0], imgsObjsIds[1]] })
          .set("Authorization", user1AuthHeader);

        expect(statusCode).toBe(400);
        expect(body.message).toMatch(/does not match any files/);
      })
    })

    describe("given init commment has 9 and given 2 new imgs", () => {
      it("returns 400 bad request", async () => {
        const imgObjs = getInitCommentImgObjects(9);
        const commToPatch = await Comment.create({
          onPost: postByUser1._id, createdBy: user1.id, imgs: imgObjs
        });
        const req = requests(app)
          .patch(`/comments/${commToPatch.id}`)
          .set("Authorization", user1AuthHeader);
        const { body, statusCode } = await attachNFiles("imgs", jpegImgPath, 2, req);

        expect(statusCode).toBe(400);
        const msgToExpect = getFileCountExceedsLimitMsg(imgsUploadLimit);
        expect(body.message).toBe(msgToExpect);
      })
    })

    describe("given init comm has 9 img & given 2 img to delete ids & given 3 new imgs", () => {
      it("returns 200 and 10 imgs", async () => {
        const imgObjs = getInitCommentImgObjects(9);
        const commToPatch = await Comment.create({
          onPost: postByUser1._id, createdBy: user1.id, imgs: imgObjs
        });
        const req = requests(app)
          .patch(`/comments/${commToPatch.id}`)
          .field("filesToDeleteIds", [imgsObjsIds[0], imgsObjsIds[1]])
          .set("Authorization", user1AuthHeader);
        const { body, statusCode } = await attachNFiles("imgs", jpegImgPath, 3, req);

        expect(statusCode).toBe(200);
        expect(body.imgs.length).toBe(10);
      })
    })

    describe("given init comm has 9 img & given 2 img to delete ids & given 4 new imgs", () => {
      it("returns 400 bad request", async () => {
        const imgObjs = getInitCommentImgObjects(9);
        const commToPatch = await Comment.create({
          onPost: postByUser1._id, createdBy: user1.id, imgs: imgObjs
        });
        const req = requests(app)
          .patch(`/comments/${commToPatch.id}`)
          .field("filesToDeleteIds", [imgsObjsIds[0], imgsObjsIds[1]])
          .set("Authorization", user1AuthHeader);
        const { body, statusCode } = await attachNFiles("imgs", jpegImgPath, 4, req);

        expect(statusCode).toBe(400);
        const msgToExpect = getFileCountExceedsLimitMsg(imgsUploadLimit);
        expect(body.message).toBe(msgToExpect);
      })
    })
  })
})
