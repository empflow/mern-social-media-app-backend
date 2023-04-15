export default function getMongoUri() {
  const nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === "dev" || nodeEnv === "prod") {
    return process.env.MONGO_URI as string;
  } else {
    return process.env.TEST_MONGO_URI as string;
  }
}
