import rateLimit, { Options } from "express-rate-limit";


const limiterConfig: Partial<Options> = {
  max: 3,
  windowMs: 60000,
  message: "Too many requests. Please try again later"
}
const rateLimiter = rateLimit(limiterConfig);

export default rateLimiter;
