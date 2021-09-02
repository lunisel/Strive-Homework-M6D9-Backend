import express from "express";
import UserModel from "./schema.js";
const userRouter = express.Router();

userRouter.post("/", async (req, resp, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    resp.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/", async (req, resp, next) => {
  try {
    const user = UserModel.find();
    resp.send(user);
  } catch (err) {
    next(err);
  }
});

export default userRouter;
