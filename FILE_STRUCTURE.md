# Elacare - Complete File Structure Reference

## Project Root Structure

```
elacare-web/
├── README.md                    # Main project documentation
├── QUICKSTART.md               # Getting started guide
├── DEPLOYMENT.md               # Production deployment guide
├── package.json                # Root package configuration
├── .gitignore                  # Git ignore rules
│
├── frontend/                   # React.js Frontend Application
│   ├── public/
│   │   └── index.html         # HTML entry point
│   │
│   ├── src/
│   │   ├── pages/             # Page components (React Router)
│   │   │   ├── Login.jsx      # User login page
│   │   │   ├── SignUp.jsx     # User registration page
│   │   │   ├── Dashboard.jsx  # Main sensor dashboard
│   │   │   └── LeafScanner.jsx # AI leaf health scanner
│   │   │
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx     # Top navigation bar
│   │   │   ├── SensorCard.jsx # Individual sensor display card
│   │   │   └── FertilizerAdvice.jsx # Smart recommendations
│   │   │
│   │   ├── context/           # React Context (State Management)
│   │   │   └── AuthContext.jsx # Authentication context
│   │   │
│   │   ├── App.jsx            # Main App component & routing
│   │   ├── index.jsx          # React root ReactDOM.render()
│   │   ├── index.css          # Global styles
│   │   ├── api.js             # Axios HTTP client setup
│   │   └── firebase.js        # Firebase initialization
│   │
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind CSS customization
│   ├── postcss.config.js      # PostCSS plugins
│   ├── .env.local.example     # Environment variables template
│   ├── .env.local             # (local only) Actual environment vars
│   ├── README.md              # Frontend-specific documentation
│   └── .gitignore             # Frontend git ignores
│
├── backend/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── routes/            # API endpoint definitions
│   │   │   ├── auth.js        # Authentication endpoints
│   │   │   ├── sensors.js     # Sensor data endpoints
│   │   │   └── esp32.js       # ESP32 hardware endpoints
│   │   │
│   │   ├── firebase.js        # Firebase Admin SDK setup
│   │   └── index.js           # Express server entry point
│   │
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   ├── .env                   # (local only) Actual environment vars
│   ├── README.md              # Backend documentation
│   ├── ESP32_SKETCH.ino       # Example ESP32 Arduino code
│   └── .gitignore             # Backend git ignores
│
└── .gitignore                 # Root-level git ignores
```

## File Purposes & Descriptions

### Frontend Files

#### Pages (src/pages/)
- **Login.jsx**: User authentication page
  - Email/password input fields
  - Client-side validation
  - Firebase auth integration
  - Redirect to signup option

- **SignUp.jsx**: User registration page
  - Farm name input
  - Email/password registration
  - Password confirmation
  - Firebase account creation

- **Dashboard.jsx**: Main application page
  - Real-time Firestore listener
  - Sensor data display
  - 5 sensor cards grid
  - Fertilizer recommendation engine
  - Quick action buttons
  - Mock data fallback for demo

- **LeafScanner.jsx**: AI leaf disease detection
  - Camera access via navigator.mediaDevices
  - Image capture and upload
  - Mock AI disease detection (simulated ML)
  - Confidence scoring
  - Treatment recommendations

#### Components (src/components/)
- **Navbar.jsx**: Navigation bar
  - Elacare branding
  - Welcome message
  - Logout button
  - Dashboard link

- **SensorCard.jsx**: Individual sensor display
  - Current sensor value
  - Sensor unit (mg/kg or pH)
  - Status indicator (Optimal/Low/High)
  - Color coding
  - Optimal range display
  - Emoji icons for visual recognition

- **FertilizerAdvice.jsx**: Smart recommendation engine
  - Analyzes all 5 sensors
  - Generates cardamom-specific advice
  - Displays action items
  - Expert farming tips
  - Color-coded severity levels

#### Context (src/context/)
- **AuthContext.jsx**: Authentication state management
  - User login/signup/logout
  - Token management
  - Loading states
  - Error handling
  - useAuth() custom hook

#### Configuration Files
- **App.jsx**: Main component with React Router
  - Route definitions
  - Protected route wrapper
  - Loading screen
  - Auth provider wrapping

- **index.jsx**: React ReactDOM entry
  - Renders App to DOM
  - StrictMode for development

- **index.css**: Global Tailwind styles
  - Tailwind directives
  - Custom utilities
  - Typography setup
  - Selection styling

- **api.js**: HTTP client (Axios)
  - Base URL configuration
  - Authentication interceptor
  - Token injection in headers

- **firebase.js**: Firebase initialization
  - App initialization
  - Auth and Firestore exports
  - Config from environment variables

#### Configuration
- **package.json**: Frontend dependencies
  - React, React Router
  - Firebase SDK
  - Tailwind CSS
  - Build scripts

- **tailwind.config.js**: Tailwind customization
  - Custom color palette (Emerald Green, etc.)
  - Font configuration
  - Extended theme values

- **postcss.config.js**: PostCSS plugins
  - Tailwind CSS
  - Autoprefixer

- **.env.local.example**: Environment variable template
  - Firebase credentials placeholder
  - API base URL setup instructions

### Backend Files

#### Routes (src/routes/)
- **auth.js**: Authentication endpoints
  - POST /verify - Token verification
  - POST /set-farm-id - User farm linking
  - GET /user/:uid - User information
  - GET /health - Health check

- **sensors.js**: Sensor data management
  - GET /current - Current sensor readings
  - GET /history - Historical data retrieval
  - POST /test - Test data submission

- **esp32.js**: Hardware integration
  - POST /data - Receive ESP32 sensor data
  - GET /config/:farmId - Farm configuration
  - GET /latest/:farmId - Latest readings
  - POST /alert - Alert recording

#### Core Server Files
- **index.js**: Express server
  - Server initialization
  - Middleware setup (CORS, body-parser)
  - Route mounting
  - Error handling
  - Port configuration
  - Firebase Admin initialization

- **firebase.js**: Firebase Admin setup
  - Admin SDK initialization
  - Firestore database reference
  - Auth verification
  - Authentication middleware

#### Configuration Files
- **package.json**: Backend dependencies
  - Express, CORS
  - Firebase Admin SDK
  - dotenv for env variables
  - Axios for HTTP requests

- **.env.example**: Environment variables template
  - PORT
  - FIREBASE credentials
  - ESP32_API_KEY
  - CORS settings
  - Database URL

- **ESP32_SKETCH.ino**: Arduino sketch template
  - WiFi connection code
  - Sensor reading code (ADC)
  - HTTP POST request to server
  - Sensor calibration examples
  - Update interval management

#### Documentation
- **README.md**: Backend-specific guide
  - Features overview
  - Installation steps
  - API endpoint documentation
  - ESP32 integration guide
  - Database structure
  - Security notes
  - Troubleshooting

### Root Level Files

- **README.md**: Main project documentation
  - Project overview
  - All features described
  - Tech stack details
  - Quick start guide
  - Future roadmap

- **QUICKSTART.md**: Step-by-step setup guide
  - 5-minute setup
  - Firebase project creation
  - Environment configuration
  - Dependency installation
  - Running applications
  - Troubleshooting

- **DEPLOYMENT.md**: Production deployment
  - System architecture diagrams
  - Data flow explanation
  - Multi-platform deployment
  - Firestore security rules
  - Monitoring setup
  - Scaling considerations

- **package.json**: Root package.json
  - Setup scripts
  - Development shortcuts
  - Project metadata

- **.gitignore**: Git ignore rules
  - node_modules/ exclusion
  - Environment files
  - Build outputs
  - IDE configurations
  - OS-specific files

## Database Schema (Firestore)

```
firestore/
├── farms/
│   └── {farmId}/
│       ├── sensors/
│       │   └── current
│       │       ├── nitrogen: 45 (number)
│       │       ├── phosphorus: 35 (number)
│       │       ├── potassium: 120 (number)
│       │       ├── ph: 6.8 (number)
│       │       ├── boron: 2.1 (number)
│       │       └── lastUpdate: "2024-02-06T..." (string)
│       │
│       ├── sensorHistory/
│       │   └── {docId}
│       │       ├── nitrogen, phosphorus, potassium, ph, boron
│       │       └── timestamp: Timestamp
│       │
│       ├── alerts/
│       │   └── {docId}
│       │       ├── alertType: "high_nitrogen" (string)
│       │       ├── message: (string)
│       │       ├── severity: "high" | "medium" | "low"
│       │       ├── timestamp: Timestamp
│       │       └── read: false (boolean)
│       │
│       └── config/
│           ├── name: "Smith's Farm" (string)
│           ├── location: "Wayanad, Kerala" (string)
│           ├── updateInterval: 300 (seconds)
│           └── sensors: {enabled sensors} (map)
│
└── users/
    └── {uid}
        ├── email: "user@example.com" (string)
        ├── farmId: "farm-doc-id" (string)
        └── createdAt: "2024-02-06T..." (string)
```

## Component Props & Function Signatures

### SensorCard
```javascript
<SensorCard
  label="string"              // "Nitrogen (N)"
  value="number"              // 45
  unit="string"               // "mg/kg"
  optimal="[number, number]"  // [40, 60]
  icon="string"               // "🌱"
/>
```

### FertilizerAdvice
```javascript
<FertilizerAdvice
  nitrogen="number"     // 45
  phosphorus="number"  // 35
  potassium="number"   // 120
  boron="number"       // 2.1
  ph="number"          // 6.8
/>
```

### Navbar
```javascript
<Navbar
  user="Firebase User object"
  onLogout="function"  // () => void
/>
```

## API Endpoint Reference

```
BASE_URL: http://localhost:3001/api

AUTHENTICATION
POST   /auth/verify              - Verify Firebase token
POST   /auth/set-farm-id         - Link farm to user
GET    /auth/user/:uid           - Get user details
GET    /auth/health              - Service health check

SENSORS
GET    /sensors/current          - Get live sensor data
GET    /sensors/history          - Get historical data
POST   /sensors/test             - Submit test data

ESP32 (requires x-api-key header)
POST   /esp32/data               - Receive ESP32 sensor data
GET    /esp32/config/:farmId     - Get farm config
GET    /esp32/latest/:farmId     - Get latest readings
POST   /esp32/alert              - Record sensor alert
```

## Environment Variables

### Frontend (.env.local)
- REACT_APP_API_BASE_URL
- REACT_APP_FIREBASE_API_KEY
- REACT_APP_FIREBASE_AUTH_DOMAIN
- REACT_APP_FIREBASE_PROJECT_ID
- REACT_APP_FIREBASE_STORAGE_BUCKET
- REACT_APP_FIREBASE_MESSAGING_SENDER_ID
- REACT_APP_FIREBASE_APP_ID

### Backend (.env)
- PORT (default: 3001)
- NODE_ENV (development/production)
- FIREBASE_SERVICE_ACCOUNT
- FIREBASE_DATABASE_URL
- ESP32_API_KEY
- CORS_ORIGIN

## Key Technologies by Component

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI library |
| Frontend | React Router | Client routing |
| Frontend | Tailwind CSS | Styling |
| Frontend | Firebase SDK | Auth & DB |
| Frontend | Axios | HTTP requests |
| Backend | Express.js | API server |
| Backend | Node.js | Runtime |
| Backend | Firebase Admin | Backend auth & DB |
| Database | Firestore | Real-time database |
| Authentication | Firebase Auth | User management |
| Deployment | Vercel | Frontend hosting |
| Deployment | Railway/Heroku | Backend hosting |

---

**Complete Elacare Architecture Reference** 📚
