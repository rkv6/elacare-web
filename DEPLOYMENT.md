# Elacare Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Mobile Browser  │  │  Desktop Browser │  │ ESP32 Device │  │
│  │   (React App)    │  │    (React App)   │  │  (Sensors)   │  │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘  │
└───────────┼────────────────────────┼──────────────────┼──────────┘
            │                        │                  │
            │ HTTPS/REST             │ HTTPS/REST       │ HTTPS/REST
            │                        │                  │
┌───────────▼────────────────────────▼──────────────────▼──────────┐
│                    FIREWALL / CORS / RATE LIMITING               │
└───────────┬────────────────────────┬──────────────────┬──────────┘
            │                        │                  │
            └────────────┬───────────┘                  │
                         │                              │
        ┌────────────────▼──────────────────────────────▼─────┐
        │           Express.js Backend Server                │
        │         (Node.js on port 3001)                     │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐ │
        │  │  API Routes                                  │ │
        │  │  • /api/auth       - Authentication         │ │
        │  │  • /api/sensors    - Sensor data mgmt       │ │
        │  │  • /api/esp32      - Hardware integration   │ │
        │  └──────────────────────────────────────────────┘ │
        │                                                    │
        │  ┌──────────────────────────────────────────────┐ │
        │  │  Middleware                                  │ │
        │  │  • CORS handling                             │ │
        │  │  • Token verification                        │ │
        │  │  • Error handling                            │ │
        │  └──────────────────────────────────────────────┘ │
        └────────────────┬─────────────────────────────────┘
                         │
                         │ Firestore SDK
                         │
        ┌────────────────▼──────────────────────┐
        │   Google Firebase Cloud               │
        │                                       │
        │  ┌──────────────────────────────────┐│
        │  │  Firestore Database              ││
        │  │  • farms/{farmId}/sensors        ││
        │  │  • farms/{farmId}/sensorHistory  ││
        │  │  • users/{uid}                   ││
        │  │  • alerts/config                 ││
        │  └──────────────────────────────────┘│
        │                                       │
        │  ┌──────────────────────────────────┐│
        │  │  Firebase Authentication         ││
        │  │  • Email/Password auth           ││
        │  │  • JWT token generation          ││
        │  │  • User session management       ││
        │  └──────────────────────────────────┘│
        └───────────────────────────────────────┘
```

## Data Flow

### ESP32 → Backend → Firestore
```
1. ESP32 reads sensors (NPK, pH, Boron)
2. ESP32 sends JSON to /api/esp32/data with API key
3. Backend validates request
4. Backend stores in Firestore
5. Firestore triggers real-time updates
6. Frontend receives live update via listener
```

### User → Frontend → Backend → Firebase
```
1. User enters email/password
2. Frontend calls Firebase auth.createUserWithEmailAndPassword()
3. Firebase returns auth token
4. Frontend stores token in localStorage
5. Frontend redirects to dashboard
6. Axios interceptor adds token to all API requests
7. Backend verifies token with Firebase Admin
8. Backend queries Firestore for farm data
9. Real-time Firestore listener updates Frontend
```

## Deployment Guide

### Prerequisites
- GitHub account (for version control)
- Vercel account (for frontend)
- Railway or Heroku account (for backend)
- Firebase project already set up

### Step 1: Push to GitHub

```bash
cd elacare-web
git init
git add .
git commit -m "Initial Elacare project setup"
git remote add origin https://github.com/yourusername/elacare-web.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend

**Option A: Using Railway (Recommended - Free tier)**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → GitHub repo
4. Select `elacare-web` repository
5. Set root directory: `backend`
6. Add environment variables:
   - Copy from `backend/.env`
   - NODE_ENV: `production`
   - PORT: `3001` (Railway assigns automatically, leave blank)
7. Deploy button appears automatically

**Option B: Using Heroku**

```bash
# Install Heroku CLI
# Then in the project root:

cd backend
heroku login
heroku create elacare-backend
heroku config:set FIREBASE_SERVICE_ACCOUNT='...'
heroku config:set ESP32_API_KEY='...'
git push heroku main
```

**Option C: Using DigitalOcean App Platform**

1. Connect GitHub to DigitalOcean
2. Create App → Select repository
3. Auto-detect backend folder
4. Set environment variables
5. Deploy

### Step 3: Deploy Frontend

**Using Vercel (Recommended)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import project → Select `elacare-web`
4. Select root directory: `frontend`
5. Add environment variables:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url/api
   REACT_APP_FIREBASE_API_KEY=...
   REACT_APP_FIREBASE_AUTH_DOMAIN=...
   (etc.)
   ```
6. Click Deploy

**Using Netlify**

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub
3. New site from Git → Select repository
4. Build command: `cd frontend && npm run build`
5. Publish directory: `frontend/build`
6. Add environment variables
7. Deploy

**Using GitHub Pages**

```bash
# Update package.json:
# "homepage": "https://yourusername.github.io/elacare-web"

cd frontend
npm run build
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

npm run deploy
```

### Step 4: Update Backend Configuration

Update `backend/.env` (or deployment platform environment):

```env
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

### Step 5: Verify Deployment

1. **Test Frontend**
   - Visit: `https://your-frontend-domain.com`
   - Try SignUp/Login
   - Check Dashboard loads

2. **Test Backend**
   - Visit: `https://your-backend-url/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

3. **Test API Integration**
   - Login to frontend
   - Check browser Network tab
   - Verify API calls to backend work

4. **Test Firestore Connection**
   - Check server logs
   - Verify no Firebase credential errors

## Production Checklist

- [ ] Firebase Firestore rules configured (security)
- [ ] Firebase Authentication rules set
- [ ] CORS_ORIGIN points to frontendomain
- [ ] ESP32_API_KEY is strong and secure
- [ ] Backend environment: `production`
- [ ] HTTPS enabled on all domains
- [ ] Database backups configured
- [ ] Error logging set up (Sentry/LogRocket)
- [ ] Performance monitoring enabled
- [ ] SSL certificate valid
- [ ] Domain DNS configured correctly
- [ ] Auto-scaling enabled (if available)

## Firestore Rules for Production

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Farm data accessible only to authenticated owner
    match /farms/{farmId} {
      allow read, write: if request.auth.uid == farmId;
      
      match /{document=**} {
        allow read, write: if request.auth.uid == farmId;
      }
    }
    
    // ESP32 can write sensor data with API key
    match /farms/{farmId}/sensors/{document=**} {
      allow read: if request.auth.uid == farmId;
    }
    
    match /farms/{farmId}/sensorHistory/{document=**} {
      allow read: if request.auth.uid == farmId;
      allow create: if request.resource.data.keys().hasAll(['nitrogen', 'phosphorus', 'potassium', 'ph', 'boron']);
    }
  }
}
```

## Monitoring & Maintenance

### Set up Alerts
- Firebase: Configure billing alerts
- Backend: Set up error monitoring (Sentry)
- Frontend: Use LogRocket for user session replay

### Regular Maintenance
- Update dependencies monthly: `npm update`
- Review Firestore usage patterns
- Monitor backend performance
- Check disk space (especially logs)

### Backup Strategy
- Firebase Firestore: Auto-backed up by Google
- Export data monthly: `gcloud firestore export`
- Keep environment variables backed up securely

## Scaling Considerations

### If Traffic Grows
1. **Frontend**: Already optimized with CDN
2. **Backend**: 
   - Enable load balancing
   - Use clustering (multiple instances)
   - Implement caching (Redis)
3. **Database**:
   - Add composite indexes
   - Archive old historical data
   - Consider database sharding

### Cost Optimization
- Use Firebase free tier wisely
- Archive sensor history data
- Compress images
- Use CloudFlare CDN

## Custom Domain Setup

### Domain Registration
- Register at Namecheap, GoDaddy, Route53, etc.

### For Vercel Frontend
1. Go to Vercel project settings
2. Add custom domain
3. Add DNS records (Vercel provides)
4. Wait for verification

### For Railway/Heroku Backend
1. Go to platform settings
2. Add custom domain
3. Update frontend `.env` with new URL
4. Redeploy frontend

---

**Your Elacare application is production-ready!** 🚀🌾
