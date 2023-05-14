import multer from "multer";
import { BadRequestErr } from "./errs";
import express from "express";


export default function handleMulterUpload(
  uploadMw: express.RequestHandler, limit?: number
): express.RequestHandler {
  return function (req, res, next) {
    uploadMw(req, res, (err) => {
      if (!(err instanceof multer.MulterError)) return next(err);

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new BadRequestErr(
          `you've exceeded the limit of ${`${limit} ` ?? ""}images per post`
        ));
      } else {
        return next(err);
      }
    })
  }
}
