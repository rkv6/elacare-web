# Elacare Frontend - README

## Overview
Elacare is a modern, responsive web application for smart cardamom farm monitoring. Built with React and Tailwind CSS, it provides real-time sensor data visualization, fertilizer recommendations, and AI-powered leaf disease detection.

## Features
- ✅ User Authentication (Firebase)
- ✅ Real-time Sensor Dashboard
- ✅ Fertilizer Recommendation Engine
- ✅ AI Leaf Disease Scanner
- ✅ Mobile-First Responsive Design
- ✅ Agri-Tech Color Palette
- ✅ Historical Data Tracking

## Tech Stack
- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Auth + Firestore)
- **HTTP Client**: Axios

## Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (web app)

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env.local
```

Add your Firebase configuration:
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

3. **Get Firebase Credentials**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to Project Settings
   - Copy the SDK credentials from the web app

## Running the Application

**Development Mode**
```bash
npm start
```

The app will open at `http://localhost:3000`

**Build for Production**
```bash
npm build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   ├── SignUp.jsx          # User registration
│   │   ├── Dashboard.jsx       # Main sensor dashboard
│   │   └── LeafScanner.jsx     # Leaf disease detection
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation
│   │   ├── SensorCard.jsx      # Individual sensor display
│   │   └── FertilizerAdvice.jsx # Recommendation engine
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── App.jsx                 # Main application component
│   ├── api.js                  # HTTP client configuration
│   ├── firebase.js             # Firebase configuration
│   ├── index.jsx               # React root
│   └── index.css               # Global styles
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json
```

## Key Pages

### Login/SignUp
- Secure Firebase authentication
- Email/Password validation
- Responsive design for mobile and desktop

### Dashboard
- Real-time sensor data display
- 5 sensor cards (N, P, K, pH, Boron)
- Status indicators (Optimal/Low/High)
- Fertilizer recommendation engine
- Quick action buttons

### Leaf Scanner
- Camera access for real-time plant scanning
- Image upload capability
- AI disease detection (simulated)
- Treatment recommendations
- High confidence scoring

## Features in Detail

### Sensor Cards
Each sensor displays:
- Current value and unit
- Optimal range (mg/kg or pH)
- Status indicator with color coding
- Responsive grid layout

### Fertilizer Advice Engine
Smart recommendations based on:
- Nitrogen levels → growth and leaf color
- Phosphorus levels → root development and flowering
- Potassium levels → disease resistance
- Boron levels → flower and fruit development
- Soil pH → nutrient availability

Provides actionable advice for cardamom-specific cultivation

### Leaf Scanner
- Access device camera
- Capture leaf photos
- Upload existing images
- AI-powered disease detection
- Displays:
  - Disease name
  - Confidence percentage
  - Treatment recommendations

## Styling & Design

### Color Palette
- **Primary (#064e3b)**: Deep Emerald Green - Main brand color
- **White (#ffffff)**: Clean backgrounds and text
- **Soft Gray (#f3f4f6)**: Secondary backgrounds and borders

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Tailwind CSS Classes Used
- Grid layouts for responsive design
- Shadow and hover effects
- Custom color variables
- Smooth transitions

## API Integration

### Authentication Endpoints
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/set-farm-id` - Set user farm
- `GET /api/auth/user/:uid` - Get user info

### Sensor Endpoints
- `GET /api/sensors/current` - Get live sensor data
- `GET /api/sensors/history` - Get historical data
- `POST /api/sensors/test` - Submit test data

## State Management

### AuthContext
Manages:
- User authentication state
- Login/Signup/Logout functions
- Error handling
- Loading states

### Component State
- Sensor data (useState)
- Camera stream (useRef, useEffect)
- Form inputs
- Result display

## Real-Time Updates

Firestore listeners subscribe to sensor data and update the dashboard instantly when:
- New sensor readings arrive
- Thresholds are breached
- Farm configuration changes

## Mobile Optimization
- Viewport meta tags set correctly
- Touch-friendly button sizes
- Responsive image scaling
- Mobile-first CSS
- Camera permissions handled properly

## Security Features
- Firebase Authentication
- Protected routes
- Token verification
- Secure API calls with Axios interceptors
- Environment variable protection

## Troubleshooting

**Firebase Not Connecting**
- Verify credentials in .env.local
- Check firebaseapp.com domain
- Ensure Firestore is enabled

**Camera Not Working**
- Check browser permissions
- Mobile devices need HTTPS
- Allow camera access in browser settings

**API Errors**
- Ensure backend is running on correct port
- Check CORS configuration
- Verify API endpoints in api.js

**Styling Issues**
- Clear node_modules and reinstall
- Rebuild Tailwind CSS
- Check browser dev tools for CSS load errors

## Performance Tips
- Images are lazy-loaded
- Firestore queries are indexed
- React.StrictMode for development
- Memoization for expensive calculations
- Code splitting with React.lazy (optional)

## Future Enhancements
- Weather integration
- Predictive analytics
- Multiple farm management
- Advanced analytics dashboards
- SMS/Email notifications
- Offline functionality
- Dark mode
- Multi-language support
