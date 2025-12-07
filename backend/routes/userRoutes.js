import express from "express";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/users.js";

const router = express.Router();

// Get all users except logged-in user (for Users page)
router.get("/", protect, async (req, res) => {
  try {
    // FIX: Changed .select("name email") to "username email" to match your schema
    const users = await User.find({ _id: { $ne: req.user._id } }).select("username email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in user's profile (including populated wishlist)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist") // This will now work correctly
      .populate({ path: "friends", select: "username email" }); // FIX: Changed "name" to "username"
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// FIX: Added the missing route to add a movie to the wishlist
router.post("/wishlist/:movieId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;

    // Check if the movie is already in the wishlist
    if (user.wishlist.includes(movieId)) {
      return res.status(400).json({ message: "Movie already in wishlist" });
    }

    user.wishlist.push(movieId);
    await user.save();
    res.json({ message: "Movie added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// Delete user account
router.delete("/delete", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update logged-in user's profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // Hashing is handled by the pre-save hook
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      token: jwt.sign(
        { id: updatedUser._id, role: updatedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
