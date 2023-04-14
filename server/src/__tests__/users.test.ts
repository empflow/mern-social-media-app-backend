import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import createServer from "../utils/createServer";

const app = createServer();

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  mongoose.connect(mongod.getUri());
})

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
})

describe("auth", () => {
  describe("sing-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns created user and token", () => {
        return requests(app)
          .post("/auth/sign-up")
          .send({
            firstName: "john",
            lastName: "doe",
            email: "johndoe@gmail.com",
            password: "1234567890"
          })
          .then(res => {
            const { body, statusCode, headers } = res;
            console.log(body);
            console.log(headers);

            expect(headers["content-type"]).toMatch(/json/);
            expect(statusCode).toBe(201);
            expect(body.user).toBeDefined();
            expect(body.token).toBeDefined();
          })
      })
    })
  })
})