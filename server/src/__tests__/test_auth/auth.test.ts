import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import requests from "supertest";
import app from "../../app";
import getSignUpData from "./getSignUpData";
import { MongoMemoryServer } from "mongodb-memory-server";
import testMissingSignUpData from "./testMissingSignUpData";


const signUpData = getSignUpData();

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

describe("auth", () => {

  describe("sign-up", () => {
    describe("given all correct sign-up data", () => {
      it("returns 201 and created user", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        expect(statusCode).toBe(201);
      })
    })

    describe("not given firstName", () => {
      it("returns 400 bad request error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send({ ...signUpData });

        expect(statusCode).toBe(201);
      })
    })

    testMissingSignUpData("firstName");
    testMissingSignUpData("lastName");
    testMissingSignUpData("email");
    testMissingSignUpData("password");
  })
})
