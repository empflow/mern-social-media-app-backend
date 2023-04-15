import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import connectDB from "./utils/connectDB";
import createServer from "./utils/createServer";
import getMongoUri from "./utils/getMongoUri";
const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, async () => {
  console.log(`app running on port ${PORT}`);
  await connectDB(getMongoUri());
  console.log("DB connected");
})

export default app;
