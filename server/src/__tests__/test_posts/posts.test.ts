import dotenv from "dotenv";
dotenv.config();
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/User";
import { dbConnSetup, dbConnTeardown } from "../utils/db";


describe("posts", () => {
  let mongod: MongoMemoryServer;
  
  beforeAll(async () => mongod = await dbConnSetup());
  afterEach(async () => await User.deleteMany({}));
  afterAll(async () => await dbConnTeardown(mongod));

  describe("test", () => {
    it("runs", async () => {
      expect(true).toBe(true);
    })
  })
})
