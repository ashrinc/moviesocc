import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import Movie from "../models/Movie.js";

const router = express.Router();

// Get all movies (logged in users)
router.get("/", protect, async (req, res) => {
  try {
    const movies = await Movie.find().populate("createdBy", "username email");
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single movie
router.get("/:id", protect, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add movie (admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, releaseYear, genre } = req.body;
    const movie = await Movie.create({
      title,
      description,
      releaseYear,
      genre,
      createdBy: req.user._id,
    });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update movie (admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const { title, description, releaseYear, genre } = req.body;
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.genre = genre || movie.genre;

    const updated = await movie.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete movie (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    await movie.deleteOne();
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
