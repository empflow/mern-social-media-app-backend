import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import testMissingSignUpData from "../test_auth/testMissingSignUpData";
import { dbConnSetup, dbConnTeardown } from "../utils/db";


let mongod: MongoMemoryServer;

beforeEach(async () => mongod = await dbConnSetup());
afterEach(async () => await dbConnTeardown(mongod))


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
