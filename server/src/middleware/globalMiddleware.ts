import express, { NextFunction } from "express";
const router = express.Router();
import cors from "cors";
import corsConf from "../config/cors";
import helmet from "helmet";
import morgan from "morgan";
import { IReq, IRes } from "../utils/reqResInterfaces";


router.use(setDataPropertyOnReqObject);
router.use(express.json({ limit: "5mb" }));
router.use(express.urlencoded({ extended: true }));
router.use(cors(corsConf));
router.use(helmet());
router.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
router.use(morgan("dev"));


// make sure req.data is not undefined
function setDataPropertyOnReqObject(req: IReq, res: IRes, next: NextFunction) {
  req.data = {};
  next();
}


export default router;
