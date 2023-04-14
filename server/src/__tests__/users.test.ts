import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../utils/createServer";
import User from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import { Server } from "node:http";

const app = createServer();
let mongod: MongoMemoryServer;

beforeEach(async () => {
  mongod = await MongoMemoryServer.create();
  mongoose.connect(mongod.getUri());
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await mongod.stop();
});

const signUpData = {
  firstName: "john",
  lastName: "doe",
  email: "johndoe@gmail.com",
  password: "1234567890"
};

const userDataForModel = {
  ...signUpData,
  profilePath: getRandomProfilePath()
}

describe("auth", () => {
  describe("sing-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns created user and token", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

          expect(headers["content-type"]).toMatch(/json/);
          expect(statusCode).toBe(201);
          expect(body.user).toBeDefined();
          expect(body.token).toBeDefined();
      })
    })

    // describe("given user with this email already exists", () => {
    //   it("returns a duplicate error", async () => {
    //     // probable timeout cause: server is not running when trying to create the user
    //     await User.create(userDataForModel);
    //     const { body, statusCode, headers } = await requests(app)
    //     .post("/auth/sign-up")
    //     .send(signUpData);

    //     expect(statusCode).toBe(500);
    //   })
    // })
  })
})