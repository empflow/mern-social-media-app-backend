import requests from "supertest";
import connectDB from "../utils/connectDB";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const app = createServer();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
})

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
})

describe("auth", () => {
  describe("sign up", () => {
    it("returns the created user", async () => {
      const response = await requests(app)
        .post("/auth/sign-up")
        .send({
          firstName: "jane",
          lastName: "doe",
          email: "mytestemail@gmail.com",
          password: "1234567890"
        })
        .expect(201)
    })

    it("test", async () => {
      const response = await requests(app)
        .post("/auth/sign-up")
        .send({
          firstName: "jane",
          lastName: "doe",
          email: "mytestemail@gmail.com",
          password: "1234567890"
        })
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
        })
    })
  })
})