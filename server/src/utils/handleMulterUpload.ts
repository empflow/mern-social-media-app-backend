import multer from "multer";
import { BadRequestErr } from "./errs";
import express from "express";

export default function handleMulterUploadArray(
  uploadMw: express.RequestHandler, limit?: number
): express.RequestHandler {
  return function (req, res, next) {
    uploadMw(req, res, (err) => {
      if (!(err instanceof multer.MulterError)) return next();

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new BadRequestErr(
          `you've exceeded the limit of ${`${limit} ` ?? ""}images per post`
        ));
      }
    })
  }
}
