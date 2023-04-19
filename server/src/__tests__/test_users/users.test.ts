import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import requests from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import testMissingSignUpData from "../test_auth/testMissingSignUpData";


let mongod: MongoMemoryServer;

beforeEach(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
})

afterEach(async () => {
  await mongod.stop();
  await mongoose.disconnect();
  await mongoose.connection.close();
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

    describe("not given auth token", () => {
      it("returns 401 unauthorized error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .get("/users")

        expect(statusCode).toBe(401);
      })
    })

    describe("test", () => {
        testMissingSignUpData("firstName");
    })
  })
})
