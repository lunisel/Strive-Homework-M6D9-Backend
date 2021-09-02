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
    const users = await UserModel.find();
    resp.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.put("/:id", async (req, resp, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    resp.send(updatedUser);
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/:id", async (req, resp, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      resp
        .status(404)
        .send({ message: `User with ${req.params.id} is not found!` });
    } else {
      await UserModel.findByIdAndDelete(req.params.id);
      resp.status(204).send();
    }
  } catch (err) {
    next(err);
  }
});

export default userRouter;
