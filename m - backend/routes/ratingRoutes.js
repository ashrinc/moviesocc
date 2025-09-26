import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import Rating from "../models/Rating.js";

const router = express.Router();

// @desc   Add or update rating
router.post("/:movieId/rate", protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const movieId = req.params.movieId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1-5" });
    }

    // Check if user already rated this movie
    let existing = await Rating.findOne({ movie: movieId, user: req.user._id });

    if (existing) {
      existing.rating = rating;
      existing.review = review || existing.review;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const newRating = await Rating.create({
      movie: movieId,
      user: req.user._id,
      rating,
      review,
    });

    res.status(201).json({ message: "Rating added", rating: newRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc   Get average rating for a movie
router.get("/:movieId/average", protect, async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const result = await Rating.aggregate([
      { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
      { $group: { _id: "$movie", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, count: 0 });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
