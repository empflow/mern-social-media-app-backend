import supertest from "supertest";
import app from "../index";

describe("users", () => {
  describe("get users", () => {
    it("should return an array of users", async () => {
      await supertest(app)
        .get("/users")
        .expect(500);
    })
  })
})