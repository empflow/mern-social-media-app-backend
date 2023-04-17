import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import createAndStartServer from "./utils/createAndStartServer";

const app = createAndStartServer();

export default app;
