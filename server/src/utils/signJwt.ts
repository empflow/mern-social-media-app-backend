import jwt from "jsonwebtoken";
import getEnvVar from "./getEnvVar";

export default function signJwt(payload: string | Buffer | object) {
  const secretKey = getEnvVar("JWT_SECRET");
  const expiresIn = getEnvVar("JWT_EXPIRES_IN");
  if (!expiresIn) throw new Error("jwt expires in is undefined");
  if (!secretKey) throw new Error("jwt secret key is undefined");

  return jwt.sign(
    payload, secretKey, { expiresIn }
  )
}
