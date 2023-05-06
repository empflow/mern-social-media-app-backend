import dotenv from "dotenv";
dotenv.config();

export default function getMongoUrl() {
  const NODE_ENV = process.env.NODE_ENV;

  switch (NODE_ENV) {
    case "dev":
      return process.env.DEV_MONGO_URL as string;
    case "test":
      return process.env.TEST_MONGO_URL as string;
    case "prod":
      return process.env.PROD_MONGO_URL as string;
    default:
      throw new Error("unknown environement. Possible environments: 'dev', 'test', 'prod'");
  }
}
