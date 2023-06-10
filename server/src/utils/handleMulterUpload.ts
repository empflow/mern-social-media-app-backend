import { BadRequestErr } from "./errs";
import express from "express";
import { getFileCountExceedsLimitMsg } from "../config/multer";


export default function handleMulterUploadArray(
  uploadMw: express.RequestHandler, limit: number
): express.RequestHandler {
  return function (req, res, next) {
    uploadMw(req, res, (err) => {
      if (Array.isArray(req.files) && req.files.length > 0) {
        const filesLen = req.files.length;
          if (filesLen > limit) {
            const msg = getFileCountExceedsLimitMsg(limit);
            return next(new BadRequestErr(msg));
          }
      }

      if (err) return next(err);
      next();
    })
  }
}
