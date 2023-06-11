import getEnvVar from "../../utils/getEnvVar";

const defaultAvatarUrl400px = getEnvVar("DEFAULT_AVATAR_URL_400_PX");
const defaultAvatarUrl200px = getEnvVar("DEFAULT_AVATAR_URL_200_PX");
const defaultAvatarUrl100px = getEnvVar("DEFAULT_AVATAR_URL_100_PX");

export default function testAvatarUrlsDontMatchDefaultUrls(user: any) {
  expect(user.avatarUrl400px).toBeDefined();
  expect(user.avatarUrl400px).not.toBe(defaultAvatarUrl400px);
  expect(user.avatarUrl200px).toBeDefined();
  expect(user.avatarUrl200px).not.toBe(defaultAvatarUrl200px);
  expect(user.avatarUrl100px).toBeDefined();
  expect(user.avatarUrl100px).not.toBe(defaultAvatarUrl100px);
}
