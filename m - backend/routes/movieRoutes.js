import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import Movie from "../models/Movie.js";

const router = express.Router();

// @desc    Add a new movie (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, releaseYear, genre } = req.body;

    if (!title || !description || !releaseYear || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const movie = await Movie.create({
      title,
      description,
      releaseYear,
      genre,
      createdBy: req.user._id,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all movies (Users must be logged in)
router.get("/", protect, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single movie by ID (Users must be logged in)
router.get("/:id", protect, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a movie (Admin only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, releaseYear, genre } = req.body;

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.genre = genre || movie.genre;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a movie (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    await movie.deleteOne();
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
