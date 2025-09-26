// backend/routes/friendRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/users.js";

const router = express.Router();

// ✅ Send Friend Request
router.post("/send-request/:id", protect, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already friends
        if (targetUser.friends.includes(req.user._id)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Check if request already sent
        const existingRequest = targetUser.friendRequests.find(
            (reqObj) => reqObj.from.toString() === req.user._id.toString() && reqObj.status === "pending"
        );

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Add request to target user
        targetUser.friendRequests.push({ from: req.user._id });
        await targetUser.save();

        res.json({ message: "Friend request sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Accept Friend Request
router.put("/accept-request/:fromId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const fromUser = await User.findById(req.params.fromId);

        if (!user || !fromUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find request
        const request = user.friendRequests.find(
            (reqObj) => reqObj.from.toString() === req.params.fromId && reqObj.status === "pending"
        );

        if (!request) {
            return res.status(400).json({ message: "No pending request found" });
        }

        // Update status
        request.status = "accepted";
        user.friends.push(fromUser._id);
        fromUser.friends.push(user._id);

        await user.save();
        await fromUser.save();

        res.json({ message: "Friend request accepted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Reject Friend Request
router.put("/reject-request/:fromId", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const request = user.friendRequests.find(
            (reqObj) => reqObj.from.toString() === req.params.fromId && reqObj.status === "pending"
        );

        if (!request) return res.status(400).json({ message: "No pending request found" });

        request.status = "rejected";
        await user.save();

        res.json({ message: "Friend request rejected" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get All Friends
router.get("/friends", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("friends", "username email");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // ✅ Get pending friend requests
    router.get("/requests", protect, async (req, res) => {
        try {
            const user = await User.findById(req.user._id)
                .populate("friendRequests.from", "username email");

            if (!user) return res.status(404).json({ message: "User not found" });

            const pending = user.friendRequests.filter(
                (reqObj) => reqObj.status === "pending"
            );

            res.json(pending);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

});

export default router;
