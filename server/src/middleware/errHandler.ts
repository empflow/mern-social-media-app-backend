import { NextFunction, Request, Response } from "express";
import ApiErr, { ErrCodes } from "../utils/errs/ApiErr";
import { TApiErrs } from "../utils/errs";
import { MongoError } from "mongodb";

type TErr = TApiErrs | Error | MongoError;

interface IErrObject {
  message: string,
  code?: number,
  duplicates?: string[]
}

export default function errHandler(
  err: TErr, req: Request, res: Response, next: NextFunction
) {
  const errObj: IErrObject = {
    message: err.message || "No error message was provided"
  }
  let code = 500;

  if (err instanceof ApiErr) {
    code = (err as ApiErr).code;
  } else if (err instanceof MongoError) {
    code = ErrCodes.BadRequest;
  } else {
    console.error(err);
  }

  res.status(code).json(errObj);
}
