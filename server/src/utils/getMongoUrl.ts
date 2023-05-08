import dotenv from "dotenv";
import getEnvVar from "./getEnvVar";
dotenv.config();


export default function getMongoUrl() {
  const NODE_ENV = getEnvVar("NODE_ENV");
  const DEV_MONGO_URL = getEnvVar("DEV_MONGO_URL");
  const TEST_MONGO_URL = getEnvVar("TEST_MONGO_URL");
  const PROD_MONGO_URL = getEnvVar("PROD_MONGO_URL");

  switch (NODE_ENV) {
    case "dev":
      return DEV_MONGO_URL;
    case "test":
      return TEST_MONGO_URL;
    case "prod":
      return PROD_MONGO_URL;
    default:
      throw new Error("unknown environement. Possible environments: 'dev', 'test', 'prod'");
  }
}
