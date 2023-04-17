import express from "express";
import allRoutes from "../routes/index";
import globalMiddleware from "../middleware/globalMiddleware";
import notFound from "../middleware/notFound";
import errHandler from "../middleware/errHandler";
import connectDB from "./connectDB";
import getMongoUri from "./getMongoUri";
const NODE_ENV = process.env.NODE_ENV;
let PORT = process.env.PORT || 3000;

export default function createAndStartServer() {
  const app = express();

  app.use(globalMiddleware);
  app.use(allRoutes);
  app.use(notFound);
  app.use(errHandler);

  if (NODE_ENV === "test") PORT = 0; // dynamic port (first one that's not in use)

  app.listen(PORT, async () => {
    console.log(`app running on port ${PORT}`);
    await connectDB(getMongoUri());
    console.log("DB connected")
  })

  return app;
}
