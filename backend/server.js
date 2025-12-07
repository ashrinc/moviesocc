// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

dotenv.config();

const app = express();

/* ---------- Global error handlers (capture crashes) ---------- */
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err && (err.stack || err.message || err));
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

/* ---------- Middleware ---------- */
app.use(express.json()); // parse application/json

const allowedOrigins = [
  "https://moviesocc.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl) or whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS - origin: " + origin));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.options("*", cors()); // enable preflight for all routes

/* ---------- Basic health route ---------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ---------- MongoDB connect (debug-friendly) ---------- */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log("DEBUG: Starting DB connect. MONGO_URI present?", !!uri);
  if (!uri) {
    console.warn("WARNING: MONGO_URI not set. The app will start but DB will be unavailable.");
    return false;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options as needed
    });
    console.log("✅ MongoDB connected");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed (full error):");
    // print full stack or message
    console.error(error && (error.stack || error.message || error));
    // do NOT exit here so Render captures logs and you can debug
    return false;
  }
};

/* ---------- Load routes dynamically (safer) ---------- */
const loadRoutes = async () => {
  try {
    // Adjust paths if your routes live elsewhere
    // Using dynamic import so we can catch errors and log them
    const { default: authRoutes } = await import("./routes/authRoutes.js");
    const { default: userRoutes } = await import("./routes/userRoutes.js");
    const { default: movieRoutes } = await import("./routes/movieRoutes.js");
    const { default: friendRoutes } = await import("./routes/friendRoutes.js");
    const { default: wishlistRoutes } = await import("./routes/wishlistRoutes.js");
    const { default: ratingRoutes } = await import("./routes/ratingRoutes.js");

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/movies", movieRoutes);
    app.use("/api/friends", friendRoutes);
    app.use("/api/wishlist", wishlistRoutes);
    app.use("/api/ratings", ratingRoutes);

    console.log("✅ Routes loaded");
  } catch (err) {
    console.error("❌ Error loading routes (check your route files):", err && (err.stack || err.message || err));
    // If route loading fails, we still allow the server to start for debugging.
  }
};

/* ---------- Bootstrap function ---------- */
const startServer = async () => {
  const dbOk = await connectDB();

  // load routes (even if DB failed, we try to load routes to catch errors)
  await loadRoutes();

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (process.env.PORT=${process.env.PORT || "undefined"})`);
    console.log(`DEBUG: dbOk = ${dbOk}`);
  });
};

// Start
startServer();
