import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import connectDB from "./utils/connectDB";
import createServer from "./utils/createServer";
const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, async () => {
  console.log(`app running on port ${PORT}`);
  await connectDB();
  console.log("DB connected");
})

export default app;
