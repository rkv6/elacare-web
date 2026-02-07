# Elacare - Smart Farming Tool for Cardamom Cultivation

## 🌾 Project Overview

Elacare is a comprehensive Smart Farming Dashboard designed specifically for cardamom cultivation. It combines IoT sensor technology (ESP32), intelligent data analysis, and AI-powered plant health monitoring to help farmers optimize their crop yields.

### Key Features
- **Real-Time Monitoring**: Live sensor data from your fields (N, P, K, pH, Boron)
- **Smart Recommendations**: AI-driven fertilizer advice based on soil conditions
- **Leaf Health Detection**: Camera-based plant disease detection
- **Mobile-First Design**: Fully responsive interface for field and office use
- **Secure Authentication**: Firebase-based user management
- **Hardware Integration**: Direct ESP32 microcontroller connectivity

## 📁 Project Structure

```
elacare-web/
├── frontend/                 # React.js web application
│   ├── public/
│   │   └── index.html       # HTML entry point
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # State management
│   │   ├── App.jsx          # Main application
│   │   ├── api.js           # HTTP client
│   │   ├── firebase.js      # Firebase config
│   │   └── index.jsx        # React root
│   ├── tailwind.config.js   # Tailwind CSS config
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
│
├── backend/                  # Node.js + Express server
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.js      # Authentication
│   │   │   ├── sensors.js   # Sensor data
│   │   │   └── esp32.js     # Hardware integration
│   │   ├── firebase.js      # Firebase configuration
│   │   └── index.js         # Server entry point
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment template
│   └── README.md            # Backend documentation
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project (Firestore + Auth)
- ESP32 microcontroller (optional, for hardware integration)

### Setup Instructions

#### 1. Clone & Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

#### 2. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Create a web app and copy credentials

**Frontend Configuration**
```bash
cd frontend
cp .env.local.example .env.local
```
Edit `.env.local` with your Firebase credentials

**Backend Configuration**
```bash
cd backend
cp .env.example .env
```
Edit `.env` with:
- Firebase service account (from Firebase Console)
- ESP32_API_KEY (choose a strong random key)

#### 3. Start the Application

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:3001`

**Terminal 2 - Frontend**
```bash
cd frontend
npm start
```
Runs on `http://localhost:3000`

## 🌱 Features Explained

### Dashboard
- **Sensor Cards**: Display N, P, K, pH, and Boron levels with status indicators
- **Real-Time Updates**: Firestore listeners provide instant data synchronization
- **Visual Indicators**: Color-coded status (Optimal/Low/High)
- **Optimal Ranges**: Cardamom-specific nutrient ranges for maximum yields

### Fertilizer Recommendation Engine
**Smart Logic Based On:**
- **Nitrogen (N)**: 40-60 mg/kg optimal
  - Low: Apply nitrogen-rich fertilizer (20-30 kg/ha)
  - High: Reduce nitrogen, risk of soft growth
- **Phosphorus (P)**: 20-40 mg/kg optimal
  - Low: Apply SSP/DAP for root development
- **Potassium (K)**: 100-150 mg/kg optimal
  - Low: Critical for disease resistance
  - High: Continue maintenance only
- **Boron (B)**: 1.5-3.0 mg/kg optimal
  - Crucial for flowering and fruiting
- **Soil pH**: 6.0-7.5 optimal
  - Too acidic (<6.0): Apply lime
  - Too alkaline (>7.5): Apply sulfur

**Recommendations Include:**
- Specific fertilizer types and quantities
- Application timing and methods
- Expert tips for cardamom farming

### Leaf Health Scanner
- **Camera Integration**: Access device camera or upload images
- **AI Disease Detection**: Identifies common cardamom diseases:
  - Leaf Spot
  - Thrips Damage
  - Nutrient Deficiencies
  - Healthy status
- **Confidence Scoring**: ML model confidence percentage
- **Treatment Plans**: Specific actions for each disease

### Mobile-First Design
- **Responsive Grid**: Adapts from 1 column (mobile) to 5 columns (desktop)
- **Touch-Friendly**: Large buttons and spacing
- **Fast Loading**: Optimized images and code
- **Progressive Enhancement**: Works with older browsers

## 🔧 Technology Stack

### Frontend
- **React 18**: Modern component-based UI
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icons library
- **Firebase SDK**: Authentication & Firestore
- **Axios**: HTTP requests

### Backend
- **Node.js + Express**: RESTful API server
- **Firebase Admin SDK**: Database & auth management
- **Firestore**: Real-time database
- **CORS**: Cross-origin resource sharing

### Color Scheme
- **Deep Emerald Green (#064e3b)**: Primary brand color
- **White**: Clean backgrounds
- **Soft Gray (#f3f4f6)**: Secondary backgrounds

## 📡 ESP32 Integration

### Hardware Requirements
- ESP32 microcontroller
- Soil moisture sensor
- NPK sensor (N, P, K)
- pH sensor
- Boron detection sensor (optional)

### ESP32 Setup
1. Flash your ESP32 with provided Arduino sketch
2. Configure WiFi credentials
3. Set API endpoint: `http://your-server/api/esp32/data`
4. Add API key from backend `.env`

### Sample Request (from ESP32)
```cpp
POST /api/esp32/data HTTP/1.1
Host: your-server.com
Content-Type: application/json
x-api-key: YOUR_ESP32_API_KEY

{
  "farmId": "user-firestore-id",
  "nitrogen": 45,
  "phosphorus": 32,
  "potassium": 118,
  "ph": 6.8,
  "boron": 2.1,
  "temperature": 28.5,
  "humidity": 75
}
```

## 🔐 Security

- **Firebase Auth**: Secure user authentication
- **Protected Routes**: Only authenticated users access farm data
- **API Key**: ESP32 devices authenticate with unique API key
- **HTTPS**: All production traffic encrypted
- **Token Verification**: Every API request validated
- **Environment Variables**: Sensitive data never in code

## 📊 Database Schema (Firestore)

```
farms/{farmId}/
  ├── sensors/current
  │   └── {nitrogen, phosphorus, potassium, ph, boron, lastUpdate}
  ├── sensorHistory/{docId}
  │   └── {sensor data + timestamp}
  ├── alerts/{docId}
  │   └── {alertType, message, severity, timestamp}
  └── config
      └── {name, location, updateInterval}

users/{uid}/
  └── {email, farmId, createdAt}
```

## 🐛 Troubleshooting

### Frontend Issues
- **Firebase not connecting**: Check .env.local credentials
- **Camera not working**: Ensure browser permissions granted
- **Styles not loading**: Clear cache `npm install && npm start`

### Backend Issues
- **ESP32 connection failed**: Verify x-api-key header
- **Firestore errors**: Check service account permissions
- **CORS errors**: Update CORS_ORIGIN in .env

### Hardware Issues
- **ESP32 won't connect**: Check WiFi SSID and password
- **Sensor values invalid**: Calibrate sensors
- **No data received**: Verify API endpoint URL

## 📚 Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)

## 🎯 Future Enhancements

### Phase 2
- [ ] Weather API integration
- [ ] Predictive crop yield analytics
- [ ] Multi-farm management dashboard
- [ ] SMS/Email alerts for critical readings

### Phase 3
- [ ] Mobile native app (React Native)
- [ ] Advanced ML for disease detection
- [ ] Soil map visualization
- [ ] Historical trend analysis

### Phase 4
- [ ] Blockchain for crop traceability
- [ ] Marketplace integration
- [ ] IoT device management portal
- [ ] Advanced reporting and analytics

## 📝 License

This project is proprietary software for agricultural technology solutions.

## 🤝 Support

For issues or questions:
1. Check the respective README files
2. Review database schema documentation
3. Check API endpoint specifications
4. Review Firebase configuration

## 🌍 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Auto-deploy on push

### Backend (Heroku/Railway)
1. Add Procfile: `web: npm start`
2. Push to platform
3. Set environment variables
4. Add custom domain

### Firestore
- Already cloud-hosted
- Auto-scaling
- Real-time sync

---

**Built with ❤️ for Smart Farming** 🌾
