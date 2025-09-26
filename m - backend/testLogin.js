// testLogin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/users.js";
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const user = await User.findOne({ email: "your-email@example.com" });
    console.log("User found:", user);

    if (!user) return console.log("No user with this email");

    const match = await user.matchPassword("yourPassword");
    console.log("Password match:", match);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

run();
