import multer from "multer";
import { BadRequestErr } from "./errs";
import express from "express";


export default function handleMulterUploadArray(
  uploadMw: express.RequestHandler, limit: number
): express.RequestHandler {
  return function (req, res, next) {
    uploadMw(req, res, (err) => {
      if (Array.isArray(req.files) && req.files.length > 0) {
        const filesLen = req.files.length;
          if (filesLen > limit) {
            next(new BadRequestErr(`you've exceeded the limit of ${limit} images`));
          }
      }

      if (err) return next(err);
      next();
    })
  }
}
