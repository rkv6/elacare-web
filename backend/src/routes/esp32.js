import express from "express";
import { db } from "../firebase.js";
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();

// Middleware to validate ESP32 API key
const validateESP32Key = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.ESP32_API_KEY) {
    return res.status(401).json({ error: "Invalid API Key" });
  }

  next();
};

// Receive sensor data from ESP32
router.post("/data", validateESP32Key, async (req, res) => {
  try {
    const { farmId, nitrogen, phosphorus, potassium, ph, boron, temperature, humidity } = req.body;

    if (!farmId) {
      return res.status(400).json({ error: "farmId is required" });
    }

    const sensorData = {
      nitrogen: parseFloat(nitrogen) || 0,
      phosphorus: parseFloat(phosphorus) || 0,
      potassium: parseFloat(potassium) || 0,
      ph: parseFloat(ph) || 0,
      boron: parseFloat(boron) || 0,
      temperature: temperature ? parseFloat(temperature) : null,
      humidity: humidity ? parseFloat(humidity) : null,
      lastUpdate: new Date().toISOString(),
      timestamp: Timestamp.now(),
    };

    // Update current sensor data
    const sensorRef = db.collection("farms").doc(farmId).collection("sensors").doc("current");
    await sensorRef.set(sensorData, { merge: true });

    // Store historical data
    const historyRef = db.collection("farms").doc(farmId).collection("sensorHistory");
    await historyRef.add(sensorData);

    console.log(`📊 Sensor data received for farm ${farmId}:`, sensorData);

    res.json({
      success: true,
      message: "Data received successfully",
      farmId,
      timestamp: sensorData.lastUpdate,
    });
  } catch (error) {
    console.error("Error storing sensor data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get farm configuration for ESP32
router.get("/config/:farmId", validateESP32Key, async (req, res) => {
  try {
    const { farmId } = req.params;

    const farmDoc = await db.collection("farms").doc(farmId).get();

    if (!farmDoc.exists) {
      return res.status(404).json({ error: "Farm not found" });
    }

    const config = {
      farmId,
      name: farmDoc.data().name || "Unknown Farm",
      location: farmDoc.data().location || "",
      updateInterval: farmDoc.data().updateInterval || 300, // Default 5 minutes
      sensors: {
        nitrogen: farmDoc.data().sensors?.nitrogen !== false,
        phosphorus: farmDoc.data().sensors?.phosphorus !== false,
        potassium: farmDoc.data().sensors?.potassium !== false,
        ph: farmDoc.data().sensors?.ph !== false,
        boron: farmDoc.data().sensors?.boron !== false,
        temperature: farmDoc.data().sensors?.temperature || false,
        humidity: farmDoc.data().sensors?.humidity || false,
      },
    };

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest sensor reading for ESP32 validation
router.get("/latest/:farmId", validateESP32Key, async (req, res) => {
  try {
    const { farmId } = req.params;

    const sensorRef = db.collection("farms").doc(farmId).collection("sensors").doc("current");
    const sensorSnap = await sensorRef.get();

    if (sensorSnap.exists) {
      res.json(sensorSnap.data());
    } else {
      res.json({ message: "No data available yet" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for sensor alerts
router.post("/alert", validateESP32Key, async (req, res) => {
  try {
    const { farmId, alertType, message, severity } = req.body;

    if (!farmId || !alertType) {
      return res.status(400).json({ error: "farmId and alertType are required" });
    }

    const alert = {
      farmId,
      alertType,
      message,
      severity: severity || "medium",
      timestamp: Timestamp.now(),
      read: false,
    };

    await db.collection("farms").doc(farmId).collection("alerts").add(alert);

    console.log(`⚠️  Alert for farm ${farmId}:`, alert);

    res.json({
      success: true,
      message: "Alert recorded",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
