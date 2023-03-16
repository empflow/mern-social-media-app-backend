import { Request, Response } from "express";

export default function authorize(req: Request, res: Response) {
  console.log(req.headers.authorization);
}