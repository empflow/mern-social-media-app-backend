import requests from "supertest";
import mongoose from "mongoose";
import User from "../models/User";
import { getRandomProfilePath } from "../utils/pathsGenerators";
import app from "../index";

beforeEach(async () => {
  await User.deleteMany({});
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

    describe("given user with this email already exists", () => {
      it("returns a duplicate error", async () => {
        await User.create(userDataForModel);

        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send(signUpData);

        expect(headers["content-type"]).toMatch(/json/);
        expect(body.message).toBeDefined();
        expect(statusCode).toBe(409);
      })
    })

    describe("given the firstName is missing", () => {
      it("returns 400 error", async () => {
        const { body, statusCode, headers } = await requests(app)
          .post("/auth/sign-up")
          .send({ ...signUpData, firstName: undefined });

        expect(headers["content-type"]).toMatch(/json/);
        expect(statusCode).toBe(400);
        expect(body.message).toBeDefined();
      })
    })
  })
})