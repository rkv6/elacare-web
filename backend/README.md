# Elacare Backend - README

## Overview
Elacare Backend is a Node.js + Express application that serves as the heart of the Smart Farming dashboard. It handles sensor data from ESP32 devices, manages user authentication via Firebase, and provides real-time data to the frontend.

## Features
- **Firebase Authentication**: Secure user signup and login
- **Real-time Sensor Data**: Receive and store data from ESP32 devices
- **Historical Data Tracking**: Store and retrieve sensor history
- **ESP32 Integration**: Dedicated API endpoints for hardware communication
- **Data Validation**: Input validation and error handling

## Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Admin SDK credentials
- Environment variables configured

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and fill in:
- Firebase service account credentials (from Firebase Console)
- ESP32 API key (create a strong random key)
- Port and environment settings

3. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Create a Service Account and download the JSON key
   - Paste the key into FIREBASE_SERVICE_ACCOUNT in .env

## Running the Server

**Development Mode**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT)

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /verify` - Verify Firebase token
- `POST /set-farm-id` - Associate farm ID with user
- `GET /user/:uid` - Get user information
- `GET /health` - Health check

### Sensor Routes (`/api/sensors`)
- `GET /current` - Get current sensor readings (requires auth)
- `GET /history` - Get historical sensor data (requires auth)
- `POST /test` - Test sensor data submission (requires auth)

### ESP32 Routes (`/api/esp32`)
- `POST /data` - Receive sensor data from ESP32 (requires API key)
- `GET /config/:farmId` - Get farm configuration for ESP32
- `GET /latest/:farmId` - Get latest sensor readings
- `POST /alert` - Record sensor alerts

## ESP32 Integration

### Hardware Setup
1. Flash your ESP32 with a sketch that reads sensors (NPK, pH, Boron)
2. Configure the ESP32 with your WiFi credentials
3. Set the API endpoint and API key

### Example ESP32 Request
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* esp32ApiKey = "your-esp32-api-key";
const char* serverUrl = "http://your-server/api/esp32/data";
const char* farmId = "user-document-id-from-firestore";

void sendSensorData() {
  HTTPClient http;
  http.setConnectTimeout(5000);
  
  DynamicJsonDocument doc(512);
  doc["farmId"] = farmId;
  doc["nitrogen"] = analogRead(N_PIN);
  doc["phosphorus"] = analogRead(P_PIN);
  doc["potassium"] = analogRead(K_PIN);
  doc["ph"] = analogRead(PH_PIN);
  doc["boron"] = analogRead(B_PIN);
  
  String json;
  serializeJson(doc, json);
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", esp32ApiKey);
  
  int httpCode = http.POST(json);
  http.end();
}
```

## Database Structure (Firestore)

```
farms/
├── {farmId}/
│   ├── sensors/
│   │   └── current → {nitrogen, phosphorus, potassium, ph, boron, lastUpdate}
│   ├── sensorHistory/
│   │   └── {docId} → {sensor data + timestamp}
│   ├── alerts/
│   │   └── {docId} → {alertType, message, severity, timestamp}
│   └── config → {name, location, updateInterval}
│
users/
└── {uid}/
    └── {email, farmId, createdAt}
```

## Error Handling
- All endpoints return JSON responses
- Error responses include descriptive error messages
- Authentication errors return 401 status
- Validation errors return 400 status
- Server errors return 500 status

## Security Notes
- Keep ESP32_API_KEY secret and strong
- Never commit `.env` files to version control
- Use HTTPS in production
- Validate all incoming data
- Rotate API keys regularly

## Troubleshooting

**Firebase Connection Issues**
- Verify firebase service account credentials
- Check network connectivity
- Ensure Firestore database is enabled in Firebase Console

**ESP32 Not Sending Data**
- Verify ESP32_API_KEY matches in .env
- Check API endpoint URL is correct
- Monitor server logs for incoming requests

**CORS Errors**
- Update CORS_ORIGIN in .env to match frontend URL
- For development: use `http://localhost:3000`
- For production: use your actual domain

## Future Enhancements
- WebSocket support for real-time updates
- SMS/Email alerts for abnormal readings
- Data export functionality
- Multi-farm management
- Advanced analytics and reporting
