import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/users.js";

const router = express.Router();

// Send friend request
router.post("/send-request/:id", protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (targetUser.friends.includes(req.user._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    const existingRequest = targetUser.friendRequests.some(
      (r) => r.from.toString() === req.user._id.toString()
    );
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    targetUser.friendRequests.push({ from: req.user._id });
    await targetUser.save();
    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept request
router.put("/accept-request/:fromId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const fromUser = await User.findById(req.params.fromId);
    if (!fromUser) return res.status(404).json({ message: "Request sender not found" });

    const requestIndex = user.friendRequests.findIndex(
      (r) => r.from.toString() === req.params.fromId && r.status === "pending"
    );
    if (requestIndex === -1) {
      return res.status(400).json({ message: "No pending request found" });
    }

    // Add each user to the other's friends list
    user.friends.push(fromUser._id);
    fromUser.friends.push(user._id);

    // Remove the request from the list
    user.friendRequests.splice(requestIndex, 1);

    await user.save();
    await fromUser.save();
    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject request
router.put("/reject-request/:fromId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const requestIndex = user.friendRequests.findIndex(
      (r) => r.from.toString() === req.params.fromId && r.status === "pending"
    );

    if (requestIndex === -1) {
      return res.status(400).json({ message: "No pending request found" });
    }

    // Instead of changing status, just remove it
    user.friendRequests.splice(requestIndex, 1);
    await user.save();
    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user's friends list
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "username email");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending friend requests
router.get("/requests", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friendRequests.from", "username email");
    const pending = user.friendRequests.filter((r) => r.status === "pending");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

