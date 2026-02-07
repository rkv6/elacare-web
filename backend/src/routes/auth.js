import express from "express";
import { auth, db } from "../firebase.js";

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "Auth service is running" });
});

// Verify token
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decodedToken = await auth.verifyIdToken(token);

    res.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: "Invalid token",
    });
  }
});

// Create custom claim (admin only)
router.post("/set-farm-id", async (req, res) => {
  try {
    const { uid, farmId } = req.body;

    if (!uid || !farmId) {
      return res.status(400).json({ error: "uid and farmId are required" });
    }

    // Verify the user exists
    const user = await auth.getUser(uid);

    // Set custom claim
    await auth.setCustomUserClaims(uid, { farmId });

    // Also save to Firestore
    await db.collection("users").doc(uid).set(
      {
        farmId,
        email: user.email,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: "Farm ID set successfully",
      uid,
      farmId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user info
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await auth.getUser(uid);
    const userDoc = await db.collection("users").doc(uid).get();

    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      farmId: userDoc.data()?.farmId || null,
      createdAt: userDoc.data()?.createdAt || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
