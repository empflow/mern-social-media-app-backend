import { Request, Response } from "express";

export interface IReq extends Request {
  data?: any
}

export interface IRes extends Response {}