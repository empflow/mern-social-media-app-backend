import { MongoMemoryServer } from "mongodb-memory-server";
import { Document } from "mongoose";
import requests from "supertest";
import app from "../../app";
import Post from "../../models/Post";
import User, { IUser } from "../../models/User";
import { userDataForModel } from "../test_auth/auth.test";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import getAuthHeader from "../utils/getToken";


const post = {
  content: "synthesizing user research, your personal knowledge management, and more!"
}

describe("posts", () => {
  let mongod: MongoMemoryServer;
  let user: Document<IUser>;

  beforeAll(async () => mongod = await dbConnSetup());
  beforeEach(async () => {
    await Promise.all([await Post.deleteMany(), await User.deleteMany()]);
  });
  afterAll(async () => await dbConnTeardown(mongod));

  describe("create a post", () => {
    describe("not given auth token", () => {
      it("returns 401 unauthorized", async () => {
        const { body, statusCode } = await requests(app)
          .post("/users/doesntExist/posts")
          .send(post);

        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })

    describe("given auth token", () => {
      describe("user to post to doesn't exist", () => {
        it("returns 404 not found", async () => {
          const poster = await User.create(userDataForModel);
          const authHeader = getAuthHeader(poster._id);
  
          const { body, statusCode } = await requests(app)
            .post("/users/doesntExist/posts")
            .send(post)
            .set("Authorization", authHeader);
  
          expect(statusCode).toBe(404);
          expect(body.message).toBe("user to post to not found");
        })
      })
    })


    describe("poster exists and is posting to own wall", () => {
      it("returns 201 and post", async () => {
        const poster = await User.create(userDataForModel);
        const authHeader = getAuthHeader(poster._id);

        const { body, statusCode } = await requests(app)
          .post(`/users/${poster.profilePath}/posts`)
          .send(post)
          .set("Authorization", authHeader);

        console.log(body);
        expect(statusCode).toBe(201);
        expect(body.views).toBe(0);
        expect(body.likes).toBe(0);
        expect(body.dislikes).toBe(0);
        expect(body.shares).toBe(0);
        expect(body.content).toBe(post.content);
        expect(body.imageAttachments.length).toBe(0);
        expect(body.videoAttachments.length).toBe(0);
      })
    })
  })
})