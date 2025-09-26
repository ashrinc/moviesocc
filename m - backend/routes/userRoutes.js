// backend/routes/userRoutes.js
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js"; // auth middleware
import User from "../models/users.js";

const router = express.Router();

// Delete user account
router.delete("/delete", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
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

    // Update fields if provided
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
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
