import express from "express";
import allRoutes from "../routes/index";
import globalMiddleware from "../middleware/globalMiddleware";
import notFound from "../middleware/notFound";
import errHandler from "../middleware/errHandler";

export default function createServer() {
  const app = express();

  app.use(globalMiddleware);
  app.use(allRoutes);
  app.use(notFound);
  app.use(errHandler);

  return app;
}
