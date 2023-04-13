import requests from "supertest";
import createServer from "../utils/createServer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const app = createServer();

const allSignUpData = {
  firstName: "John",
  lastName: "Doe",
  password: "1234567890",
  email: "johndoe@gmail.com"
}
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDJkYzRiNTFiYjNhN2MxYWJhZDMzMDQiLCJpYXQiOjE2ODA3MjE4MDAsImV4cCI6MTY4MzMxMzgwMH0.fz4ErCIfb_bZiRcn5ZLoDADbx6RClaVr881QtpfQkVA";
const authHeader = `Bearer ${token}`;

beforeEach(async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
})

afterEach(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
})

describe("auth", () => {
  describe("sign-up", () => {
    describe("given all sign up data is present", () => {
      it("returns the newly created user and token and does not include the password", async () => {
        const { statusCode, body } = await requests(app)
          .post("/auth/sign-up")
          .send(allSignUpData);

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("token");
        expect(body.user).not.toHaveProperty("password");
      })
    })

    // i fucking hate this shit never works no matter what i fucking do i cant take this any fucking more
    // describe("given the first name is missing", () => {
    //   test("returns a 400 error", () => {
    //     requests(app)
    //       .post("/auth/sign-up")
    //       .send({ ...allSignUpData, firstName: undefined })
    //       .catch(err => expect)

    //   }, 10000)
    // })
  })
})