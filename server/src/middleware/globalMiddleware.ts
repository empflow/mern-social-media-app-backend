import express, { NextFunction } from "express";
const router = express.Router();
import cors from "cors";
import corsConf from "../config/cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { IReq, IRes } from "../utils/reqResInterfaces";

router.use(setDataPropertyOnReqObject);
router.use(express.json({ limit: "5mb" }));
// extended allows the values in req.body to be of any type
// only strings and arrays are allowed if extended is set to false
router.use(express.urlencoded({ limit: "5mb", extended: true }));
router.use(cors(corsConf));
router.use(helmet());
router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
router.use(morgan("common"));
router.use("/assets", express.static(path.join(__dirname, "../public/assets")));

// make sure req.data is not undefined
function setDataPropertyOnReqObject(req: IReq, res: IRes, next: NextFunction) {
  req.data = {};
  next();
}

export default router;