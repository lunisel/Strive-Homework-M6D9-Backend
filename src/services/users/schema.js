import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: { type: String, required: true },
});

export default model("User", userSchema);
