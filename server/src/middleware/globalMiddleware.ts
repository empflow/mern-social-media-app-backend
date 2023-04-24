import express, { NextFunction } from "express";
const router = express.Router();
import cors from "cors";
import corsConf from "../config/cors";
import helmet from "helmet";
import morgan from "morgan";
import { IReq, IRes } from "../utils/reqResInterfaces";
import path from "node:path";

const uploadsPath = path.join(__dirname, "../../uploads");

router.use(setDataPropertyOnReqObject);
router.use(express.json({ limit: "5mb" }));
router.use(express.urlencoded({ extended: true }));
router.use(cors(corsConf));
router.use(helmet());
router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
router.use(morgan("dev"));
router.use("/uploads", express.static(uploadsPath));

// make sure req.data is not undefined
function setDataPropertyOnReqObject(req: IReq, res: IRes, next: NextFunction) {
  req.data = {};
  next();
}

export default router;