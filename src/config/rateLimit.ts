import rateLimit, { Options } from "express-rate-limit";
import getEnvVar from "../utils/getEnvVar";

let max = 30;

const NODE_ENV = getEnvVar("NODE_ENV");
if (NODE_ENV === "test") max = Infinity;

const limiterConfig: Partial<Options> = {
  max,
  windowMs: 60000,
  message: "Too many requests. Please try again later"
}
const rateLimiter = rateLimit(limiterConfig);

export default rateLimiter;
