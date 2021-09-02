import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import blogRouter from "./services/blogs/index.js";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandlers,
} from "./errorHandlers.js";
import userRouter from "./services/users/index.js";

const port = process.env.PORT || 3000;
const mongooseConnection = process.env.MONGO_CONNECTION_STRING;

const server = express();

/* const whitelist = [process.env.FE_DEV_URL, "http://localhost:3001"];

const corsOpts = {
  origin: function (origin, next) {
    console.log("Origin -> ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed!`));
    }
  },
}; */

server.use(cors(/* corsOpts */));
server.use(express.json());

server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(catchAllErrorHandlers);

server.use("/blogs", blogRouter);
server.use("/users", userRouter);

server.listen(port, async () => {
  try {
    mongoose.connect(mongooseConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Server running on port ${port} and connected to db`);
  } catch (err) {
    console.log("Db connection is faild!", err);
  }
});

server.on("error", (error) => console.log(`Server failed : ${error}`));
