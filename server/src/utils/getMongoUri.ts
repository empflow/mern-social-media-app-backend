import dotenv from "dotenv";
dotenv.config();

export default function getMongoUri() {
  const NODE_ENV = process.env.NODE_ENV;

  switch (NODE_ENV) {
    case "dev":
      return process.env.DEV_MONGO_URI as string;
    case "test":
      return process.env.TEST_MONGO_URI as string;
    case "prod":
      return process.env.PROD_MONGO_URI as string;
    default:
      throw new Error("unknown environement. Possible environments: 'dev', 'test', 'prod'");
  }
}
