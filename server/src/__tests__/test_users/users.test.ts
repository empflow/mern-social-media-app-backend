import dotenv from "dotenv";
dotenv.config();
import requests from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import mockUser from "./mockUser";
import signJwt from "../../utils/signJwt";
import assertJson from "../utils/assertJson";
import getSignUpData from "../test_auth/getSignUpData";


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

    describe("given auth token", () => {
      it("returns 200 and an array of users", async () => {
        const token = signJwt({ userId: mockUser._id });

        await requests(app).post("/auth/sign-up").send(getSignUpData());
        await requests(app).post("/auth/sign-up").send(getSignUpData());

        const { body, statusCode, headers } = await requests(app)
          .get("/users")
          .set("Authorization", `Bearer ${token}`);

        assertJson(headers);
        expect(statusCode).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(2);
      })
    })
  })
})
