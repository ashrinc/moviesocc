// backend/server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());



const allowedOrigins = [
  "https://moviesocc.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.options("*", cors()); // enable preflight requests


// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// Route imports
import authRoutes from "./routes/authRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

// API Routes
app.use("/api/auth", authRoutes);          // login, register
app.use("/api/users", userRoutes);         // profile, update, delete
app.use("/api/movies", movieRoutes);       // CRUD movies (admin) + list/view
app.use("/api/friends", friendRoutes);     // friend requests, accept/reject, list
app.use("/api/wishlist", wishlistRoutes);  // wishlist add/remove/view
app.use("/api/ratings", ratingRoutes);     // add/update ratings + average

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Port
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
