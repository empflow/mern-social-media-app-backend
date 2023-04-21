import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import app from "../../app";
import getAuthHeader from "../utils/getToken";
import getSignUpData from "../utils/getSignUpData";
import assertJson from "../utils/assertJson";
import User from "../../models/User";
import { userDataForModel } from "../test_auth/auth.test";
import mongoose from "mongoose";


describe("users", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => mongod = await dbConnSetup());
  afterAll(async () => await dbConnTeardown(mongod));

  describe("get users", () => {
    describe("not given auth token", () => {
      it("returns 401 unauthorized error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .get("/users")

        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })

    describe("given auth token", () => {
      it("returns 200 and an array of users", async () => {
        const authHeader = getAuthHeader();

        await requests(app).post("/auth/sign-up").send(getSignUpData());
        await requests(app).post("/auth/sign-up").send(getSignUpData());

        const { body, statusCode, headers } = await requests(app)
          .get("/users")
          .set("Authorization", authHeader);

        assertJson(headers);
        expect(statusCode).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(2);
      })
    })
  })

  describe("get a single user", () => {
    describe("not given auth token", () => {
      it("returns 401 unauthorized error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .get(`/users/${"profilePath"}`);
        
        expect(statusCode).toBe(401);
      })
    })

    describe("given auth token", () => {
      it("returns a signle user", async () => {
        const authHeader = getAuthHeader();

        await User.create(userDataForModel);
        const { body, statusCode, headers } = await requests(app)
          .get(`/users/${userDataForModel.profilePath}`)
          .set("Authorization", authHeader);

        expect(statusCode).toBe(200);
        expect(body.password).toBeUndefined();
        expect(body.profilePath).toBe(userDataForModel.profilePath);
        expect(body.firstName).toBe(userDataForModel.firstName);
        expect(body.lastName).toBe(userDataForModel.lastName);
        expect(body.email).toBe(userDataForModel.email);
      })
    })

    describe("given auth token but user doesn't exist", () => {
      it("returns 404 not found error", async () => {
        const authHeader = getAuthHeader();

        const { body, statusCode, headers } = await requests(app)
          .get("/users/doesntExist")
          .set("Authorization", authHeader);
        
        expect(statusCode).toBe(404);
        expect(body.message).toBe("user not found");
      })
    })

    describe("not given auth token and user doesn't exist", () => {
      it("returns 404 not found error", async () => {
        const authHeader = getAuthHeader();

        const { body, statusCode, headers } = await requests(app)
          .get("/users/doesntExist");
        
        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })
  })

  describe("get user by ID", () => {
    describe("given valid id but not given auth token and user doesn't exist", () => {
      const id = new mongoose.Types.ObjectId().toString();

      it("returns 401 unauthorized error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .get(`/users/${id}`);

        assertJson(headers);
        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })
  })
})
