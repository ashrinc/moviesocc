import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/users.js";

const main = async () => {
  await connectDB();

  // usage: node scripts/createAdmin.js <ADMIN_SECRET> <username> <email> <password>
  const [, , providedSecret, username = "admin", email = "admin@example.com", password = "admin123"] =
    process.argv;

  if (!providedSecret || providedSecret !== process.env.ADMIN_SECRET) {
    console.error("Missing or incorrect admin secret. Pass the ADMIN_SECRET as first argument.");
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("User with that email already exists:", existing.email);
    process.exit(0);
  }

  const admin = new User({ username, email, password, role: "admin" });
  await admin.save();
  console.log("Admin created:", { id: admin._id.toString(), email: admin.email });
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
