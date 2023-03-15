import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function signUp(req: Request, res: Response) {
  console.log("sign up");
}

export function signIn(req: Request, res: Response) {
  console.log("sign in");
}