import jwt from "jsonwebtoken";

export default function signJwt(payload: string | Buffer | object) {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) throw new Error("jwt expires in is undefined");
  if (!secretKey) throw new Error("jwt secret key is undefined");

  return jwt.sign(
    payload, secretKey, { expiresIn }
  )
}