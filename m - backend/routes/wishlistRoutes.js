// routes/wishlistRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Movie from "../models/Movie.js";
import User from "../models/users.js";

const router = express.Router();

// @desc   Add movie to wishlist
router.post("/:movieId", protect, async (req, res) => {
  try {
    const movieId = req.params.movieId;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const user = await User.findById(req.user._id);

    // Prevent duplicates
    if (user.wishlist.includes(movieId)) {
      return res.status(400).json({ message: "Movie already in wishlist" });
    }

    user.wishlist.push(movieId);
    await user.save();

    res.json({ message: "Movie added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Remove movie from wishlist
router.delete("/:movieId", protect, async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== movieId);
    await user.save();

    res.json({ message: "Movie removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Get own wishlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Get wishlist of a friend (only if they are friends)
router.get("/:userId", protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId).populate("wishlist");

    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFriend = targetUser.friends.some(
      (friendId) => friendId.toString() === req.user._id.toString()
    );

    if (req.user._id.toString() !== targetUser._id.toString() && !isFriend) {
      return res.status(403).json({ message: "You can only view your own or your friends' wishlists" });
    }

    res.json(targetUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
