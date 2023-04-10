import requests from "supertest";
import createServer from "../utils/createServer";

const app = createServer();

describe("users", () => {
  describe("get users", () => {
    it("returns 401", async () => {
      await requests(app)
        .get("/users")
        .expect(401);
    })
  })
})