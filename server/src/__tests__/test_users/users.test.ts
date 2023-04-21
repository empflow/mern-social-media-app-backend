import requests from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbConnSetup, dbConnTeardown } from "../utils/db";
import app from "../../app";
import getAuthHeader from "../utils/getToken";
import getSignUpData from "../utils/getSignUpData";
import User, { IUser } from "../../models/User";
import { userDataForModel } from "../test_auth/auth.test";
import mongoose, { Document } from "mongoose";


describe("users", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => mongod = await dbConnSetup());
  afterEach(async () => await User.deleteMany());
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

        const { body, statusCode } = await requests(app)
          .get("/users")
          .set("Authorization", authHeader);

        expect(statusCode).toBe(200);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(2);
        for (const user in body) {
          expect(body[user].password).toBeUndefined();
        }
      })
    })
  })

  describe("get a single user", () => {
    describe("not given auth token", () => {
      it("returns 401 unauthorized error", async () => {
        const { body, statusCode } = await requests(app)
          .get(`/users/${"profilePath"}`);
        
        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })
    
    describe("given auth token", () => {
      it("returns a single user", async () => {
        const authHeader = getAuthHeader();
        await User.create(userDataForModel);
        
        const { body, statusCode } = await requests(app)
        .get(`/users/${userDataForModel.profilePath}`)
        .set("Authorization", authHeader);
        
        expect(statusCode).toBe(200);
        expect(body.password).toBeUndefined();
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
        const { body, statusCode, headers } = await requests(app)
        .get("/users/doesntExist");
        
        expect(statusCode).toBe(401);
        expect(body.message).toBe("unauthorized");
      })
    })
  })
  
  describe("get user by ID", () => {
    describe("given user exists", () => {
      describe("given valid id but not given auth token", () => {
        it("returns 401 unauthorized error", async () => {
          const user = await User.create(userDataForModel)
          
          const { body, statusCode } = await requests(app)
          .get(`/users/id/${user.id}`);
          
          expect(statusCode).toBe(401);
          expect(body.message).toBe("unauthorized");
        })
      })
      
      describe("given valid id and given auth token", () => {
        it("returns 200 and user", async () => {
          const user = await User.create(userDataForModel);
          const authHeader = getAuthHeader();
    
          const { body, statusCode } = await requests(app)
            .get(`/users/id/${user.id}`)
            .set("Authorization", authHeader);
    
          expect(statusCode).toBe(200);
          expect(body._id).toBe(user.id);
          expect(body.password).toBeUndefined();
        })
      })

      describe("given invalid id and not given auth token", () => {
        it("returns 401 unauthorized error", async () => {
          await User.create(userDataForModel);

          const { body, statusCode } = await requests(app)
            .get(`/users/id/invalidId`);

          expect(statusCode).toBe(401);
          expect(body.message).toBe("unauthorized");
        })
      })

      describe("given invalid id and given auth token", () => {
        it("returns 400 bad request error", async () => {
          await User.create({ ...userDataForModel });
          const authHeader = getAuthHeader();

          const { body, statusCode } = await requests(app)
            .get("/users/id/invalidId")
            .set("Authorization", authHeader);

          expect(statusCode).toBe(400);
          expect(body.message).toMatch(/Cast to ObjectId failed for value.+at path "_id" for model "User"/)
        })
      })
    })

    describe("given user doesn't exist", () => {
      describe("given valid id but not given auth token", () => {
        it("returns 401 unauthorized error", async () => {
          const id = new mongoose.Types.ObjectId().toString();
  
          const { body, statusCode } = await requests(app)
            .get(`/users/id/${id}`);

          expect(statusCode).toBe(401);
          expect(body.message).toBe("unauthorized");
        })

        describe("given valid id and given auth token", () => {
          it("returns 404 not found error", async () => {
            const id = new mongoose.Types.ObjectId().toString();
            const authHeader = getAuthHeader();

            const { body, statusCode } = await requests(app)
              .get(`/users/id/${id}`)
              .set("Authorization", authHeader);

            expect(statusCode).toBe(404);
            expect(body.message).toBe("user not found");
          })
        })

        describe("given invalid id and not given auth token", () => {
          it("returns 401 unauthorized", async () => {
            const { body, statusCode } = await requests(app)
              .get(`/users/id/invalidId`);

            expect(statusCode).toBe(401);
            expect(body.message).toBe("unauthorized");
          })
        })

        describe("given invalid id and given auth token", () => {

        })
      })
    })
  })
})
