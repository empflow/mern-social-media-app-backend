import path from "node:path";
import attachAvatarToSignUpReq from "./attachAvatarToSignUpReq";
import testAvatarUrlsDontMatchDefaultUrls from "./testAvatarUrlsDontMatchDefaultUrls";

export async function testSignUpWithUnsupportedAvatarExt(relativeAvatarPath: string) {
  const avatarExt = path.extname(relativeAvatarPath);

  describe(`test ${avatarExt} avatar`, () => {
    it("returns 400 bad request because ext is unsupported", async () => {
      const avatarPath = path.join(__dirname, relativeAvatarPath);
      const { body, statusCode } = await attachAvatarToSignUpReq(avatarPath);
      
      expect(statusCode).toBe(400);
      expect(body.user).toBeUndefined();
      expect(body.message).toMatch(/Forbidden file extension/);
    }, 10000)
  })
}

export async function testSignUpWithSupportedAvatarExt(relativeAvatarPath: string) {
  const avatarExt = path.extname(relativeAvatarPath);
  
  describe(`test ${avatarExt} avatar`, () => {
    it("returns 201 created", async () => {
      const avatarPath = path.join(__dirname, relativeAvatarPath);
      const { body, statusCode } = await attachAvatarToSignUpReq(avatarPath);
      
      expect(statusCode).toBe(201);
      testAvatarUrlsDontMatchDefaultUrls(body.user);
    }, 10000)
  })
}
