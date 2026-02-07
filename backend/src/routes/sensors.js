import express from "express";
import { db, authenticateUser } from "../firebase.js";
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();

// Get current sensor data
router.get("/current", authenticateUser, async (req, res) => {
  try {
    const sensorRef = db.collection("farms").doc(req.userId).collection("sensors").doc("current");
    const sensorSnap = await sensorRef.get();

    if (sensorSnap.exists) {
      res.json(sensorSnap.data());
    } else {
      // Return mock data if not available
      res.json({
        nitrogen: 45,
        phosphorus: 35,
        potassium: 120,
        ph: 6.8,
        boron: 2.1,
        lastUpdate: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical sensor data
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    let query = db
      .collection("farms")
      .doc(req.userId)
      .collection("sensorHistory")
      .orderBy("timestamp", "desc")
      .limit(parseInt(limit));

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      query = query.where("timestamp", ">=", Timestamp.fromDate(start)).where("timestamp", "<=", Timestamp.fromDate(end));
    }

    const snapshot = await query.get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp,
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post sensor data (for testing)
router.post("/test", authenticateUser, async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, boron } = req.body;

    const sensorRef = db.collection("farms").doc(req.userId).collection("sensors").doc("current");
    const historyRef = db.collection("farms").doc(req.userId).collection("sensorHistory");

    const data = {
      nitrogen: parseFloat(nitrogen) || 45,
      phosphorus: parseFloat(phosphorus) || 35,
      potassium: parseFloat(potassium) || 120,
      ph: parseFloat(ph) || 6.8,
      boron: parseFloat(boron) || 2.1,
      lastUpdate: new Date().toISOString(),
    };

    // Update current sensors
    await sensorRef.set(data);

    // Add to history
    await historyRef.add({
      ...data,
      timestamp: Timestamp.now(),
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
