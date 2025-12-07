import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import Movie from "../models/Movie.js"; // Ensure you have a Movie model
import Rating from "../models/Rating.js";

const router = express.Router();

// HELPER: Function to update a movie's average rating
const updateMovieAverageRating = async (movieId) => {
  const stats = await Rating.aggregate([
    { $match: { movie: new mongoose.Types.ObjectId(movieId) } },
    { $group: { _id: "$movie", avgRating: { $avg: "$rating" } } },
  ]);

  if (stats.length > 0) {
    // If ratings exist, update the movie with the new average
    await Movie.findByIdAndUpdate(movieId, { avgRating: stats[0].avgRating });
  } else {
    // If all ratings are gone, reset the average to 0
    await Movie.findByIdAndUpdate(movieId, { avgRating: 0 });
  }
};

// @desc   Add or update a rating for a movie
router.post("/:movieId/rate", protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { movieId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find existing rating or create a new one
    const existingRating = await Rating.findOne({ movie: movieId, user: req.user._id });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review || "";
      await existingRating.save();
    } else {
      await Rating.create({
        movie: movieId,
        user: req.user._id,
        rating,
        review,
      });
    }

    // CRITICAL FIX: After rating, update the movie's average score
    await updateMovieAverageRating(movieId);

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Server error while submitting rating." });
  }
});

export default router;

