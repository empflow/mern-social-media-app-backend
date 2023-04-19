import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import requests from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";


beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
})


describe("users", () => {
  describe("get users", () => {
    describe("not given auth token", () => {
      it("returns 401 unauthorized error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .get("/users")

        expect(statusCode).toBe(401);
      })
    })
  })
})
