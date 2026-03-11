import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const app = express();

// Middleware - Explicit CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} from ${req.ip || req.socket.remoteAddress}`);  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Import routes dynamically after Firebase initialization
const authRoutes = await import("./routes/auth.js");
const sensorRoutes = await import("./routes/sensors.js");
const esp32Routes = await import("./routes/esp32.js");
const aiRoutes = await import("../routes/ai.js");

app.use("/api/auth", authRoutes.default);
app.use("/api/sensors", sensorRoutes.default);
app.use("/api/esp32", esp32Routes.default);
app.use("/api/ai", aiRoutes.default);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n✅ Elacare Backend initialized`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📊 Local: http://localhost:${PORT}/health`);
  console.log(`📡 Check your actual IP with: ipconfig /all\n`);
});
