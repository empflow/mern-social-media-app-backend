import dotenv from "dotenv";
import getEnvVar from "./getEnvVar";
dotenv.config();


export default function getMongoUrl() {
  const NODE_ENV = getEnvVar("NODE_ENV");
  const DEV_MONGO_URL = getEnvVar("DEV_MONGO_URL");
  const PROD_MONGO_URL = getEnvVar("PROD_MONGO_URL");

  if (NODE_ENV === "dev") return DEV_MONGO_URL;
  if (NODE_ENV === "prod") return PROD_MONGO_URL;

  throw new Error("unknown environement. Possible environments are 'dev' and 'prod'");
}
