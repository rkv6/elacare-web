# Elacare Testing Guide

## Unit Testing Setup (Optional)

### Frontend Testing

Install testing dependencies:
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

Example test (src/components/SensorCard.test.jsx):
```javascript
import { render, screen } from '@testing-library/react';
import SensorCard from './SensorCard';

test('renders sensor card with correct value', () => {
  render(
    <SensorCard
      label="Nitrogen"
      value={45}
      unit="mg/kg"
      optimal={[40, 60]}
      icon="🌱"
    />
  );
  
  expect(screen.getByText('Nitrogen')).toBeInTheDocument();
  expect(screen.getByText('45')).toBeInTheDocument();
  expect(screen.getByText('Optimal')).toBeInTheDocument();
});
```

### Backend Testing

Install dependencies:
```bash
cd backend
npm install --save-dev supertest jest
```

Example test (src/routes/sensors.test.js):
```javascript
const request = require('supertest');
const app = require('../index');

describe('Sensor Routes', () => {
  test('GET /current returns sensor data', async () => {
    const response = await request(app)
      .get('/api/sensors/current')
      .set('Authorization', 'Bearer ' + mockToken);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nitrogen');
  });
});
```

## Manual Testing Checklist

### 1. Authentication Flow

**Test SignUp:**
- [ ] Navigate to /signup
- [ ] Enter farm name, email, password
- [ ] Verify password match validation
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check user created in Firebase Console

**Test Login:**
- [ ] Navigate to /login
- [ ] Enter incorrect credentials
- [ ] Verify error message displays
- [ ] Enter correct credentials
- [ ] Verify redirect to dashboard

**Test Logout:**
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Try accessing /dashboard directly
- [ ] Verify redirect to login (protected route working)

### 2. Dashboard Testing

**Sensor Cards:**
- [ ] All 5 cards display (N, P, K, pH, Boron)
- [ ] Values update when Firestore data changes
- [ ] Status indicators show correct colors
  - Green = Optimal
  - Yellow = Low
  - Red = High
- [ ] Hover effects work on cards
- [ ] Responsive on mobile (1 column)
- [ ] Responsive on tablet (2-3 columns)
- [ ] Responsive on desktop (5 columns)

**Fertilizer Advice:**
- [ ] Displays recommendations based on values
- [ ] Specific advice for Cardamom farming
- [ ] Color-coded severity (green/red)
- [ ] Action items are clear
- [ ] Expert tips section visible

**Quick Actions:**
- [ ] "Leaf Health Check" button navigates correctly
- [ ] Button hover effects work
- [ ] Responsive on all devices

### 3. Leaf Scanner Testing

**Camera Access:**
- [ ] Click "Capture Photo" button
- [ ] Browser requests camera permission
- [ ] Grant permission
- [ ] Verify video stream displays
- [ ] Camera feed shows real-time video

**Photo Capture:**
- [ ] Click "Capture Photo"
- [ ] Verify photo displays in preview
- [ ] Photo quality is acceptable
- [ ] Photo taken from live feed (not random)

**Image Upload:**
- [ ] Click "Upload Photo"
- [ ] Select an image from device
- [ ] Image displays in preview
- [ ] File browser closes after selection

**Leaf Analysis:**
- [ ] Click "Analyze Leaf"
- [ ] Verify loading state displays
- [ ] Load time ~2 seconds (simulated ML)
- [ ] Results display with:
  - [ ] Disease/condition name
  - [ ] Confidence percentage
  - [ ] Recommended treatments
  - [ ] Status color indicator

**Reset Functionality:**
- [ ] Click "Scan Another Leaf"
- [ ] Verify camera restarts
- [ ] Previous results clear

### 4. API Integration Testing

**Backend Running:**
```bash
# In terminal:
curl http://localhost:3001/health
# Expected: {"status":"OK","timestamp":"..."}
```

**Authentication Endpoint:**
```bash
# Test token verification
curl -X POST http://localhost:3001/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_FIREBASE_TOKEN"}'
```

**Sensor Endpoint:**
```bash
# Test reading sensor data
curl http://localhost:3001/api/sensors/current \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**ESP32 Endpoint:**
```bash
# Simulate ESP32 data
curl -X POST http://localhost:3001/api/esp32/data \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ESP32_API_KEY" \
  -d '{
    "farmId":"test-farm",
    "nitrogen":45,
    "phosphorus":35,
    "potassium":120,
    "ph":6.8,
    "boron":2.1
  }'
```

### 5. Real-Time Updates Testing

**Setup:**
1. Open dashboard in 2 browser tabs
2. Call ESP32 data endpoint (curl command above)
3. Both tabs should update instantly

**Verify:**
- [ ] Firestore listener is active
- [ ] New data triggers UI update
- [ ] All sensor cards reflect new values
- [ ] Timestamp updates

### 6. Mobile Responsiveness

**On Mobile Device:**
- [ ] Text is readable without zoom
- [ ] Buttons are touch-friendly (48px minimum)
- [ ] No horizontal scroll
- [ ] Camera access works
- [ ] Image upload works
- [ ] Sensor cards stack vertically
- [ ] Navbar is mobile-optimized

**Test Devices:**
- [ ] iPhone (various sizes)
- [ ] Android (various sizes)
- [ ] iPad
- [ ] Android tablet

### 7. Error Handling

**Login Errors:**
- [ ] Invalid email format shows error
- [ ] Weak password shows error
- [ ] User not found shows error
- [ ] Server down shows error message

**Camera Errors:**
- [ ] No camera permission shows message
- [ ] Camera in use shows error
- [ ] Browser doesn't support shows fallback

**API Errors:**
- [ ] No internet connection shows error
- [ ] Invalid token shows login redirect
- [ ] Server error shows user-friendly message

### 8. Performance Testing

**Load Time:**
- [ ] Login page: < 2 seconds
- [ ] Dashboard load: < 3 seconds with data
- [ ] Leaf scanner load: < 2 seconds
- [ ] Images load without lag

**Bundle Size:**
```bash
# Check frontend build size
cd frontend
npm run build
# Check dist/index.html size
```

**Network Tab (Chrome DevTools):**
- [ ] Images are optimized
- [ ] No unnecessary requests
- [ ] API responses are fast
- [ ] Firestore queries are indexed

### 9. Security Testing

**Authentication:**
- [ ] Tokens are stored securely (localStorage)
- [ ] Tokens included in API requests
- [ ] Invalid tokens rejected
- [ ] CORS headers correct

**API Security:**
- [ ] ESP32 endpoint requires API key
- [ ] Invalid API key rejected
- [ ] Users can't access other user data
- [ ] Firestore rules enforced

### 10. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

Features to verify in each:
- [ ] Camera access
- [ ] Video streaming
- [ ] File upload
- [ ] CSS styling
- [ ] JavaScript execution
- [ ] Auth tokens

## Automated Testing Commands

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# Both
npm run test:all
```

## Performance Benchmarks

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s
- **API Response Time**: < 200ms

Check using:
- Chrome DevTools Lighthouse
- WebPageTest.org
- GTmetrix.com

## Stress Testing

### Load Test Backend
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3001/health

# Or using hey
go get -u github.com/rakyll/hey
hey -n 1000 -c 10 http://localhost:3001/health
```

### Load Test Firestore
- Monitor in Firebase Console
- Create 100s of test users
- Send rapid sensor updates
- Watch real-time updates performance

## Common Issues & Solutions

### "Cannot find module"
- Solution: `npm install` in that directory

### "CORS error"
- Solution: Check CORS_ORIGIN in backend .env

### "Firebase not connecting"
- Solution: Verify credentials in .env files

### "Camera permission denied"
- Solution: Check browser permissions
- Chrome: Camera icon in address bar
- Firefox: Preferences → Privacy → Permissions

### "Sensor data not updating"
- Solution: Check Firestore listener in console
- Check network tab for API calls
- Verify Firestore rules allow access

## Test Data

### Demo User Credentials
```
Email: demo@elacare.com
Password: Demo123!Farm
```

### Test Sensor Values
```javascript
{
  nitrogen: 45,      // Optimal
  phosphorus: 35,    // Slightly low
  potassium: 120,    // Optimal
  ph: 6.8,           // Optimal
  boron: 2.1         // Optimal
}
```

### Test Alert Cases
```javascript
// Low Nitrogen
{ nitrogen: 25, phosphorus: 35, potassium: 120, ph: 6.8, boron: 2.1 }

// High Potassium
{ nitrogen: 45, phosphorus: 35, potassium: 200, ph: 6.8, boron: 2.1 }

// Acidic soil
{ nitrogen: 45, phosphorus: 35, potassium: 120, ph: 5.5, boron: 2.1 }
```

## Continuous Integration (Optional)

### GitHub Actions Workflow (.github/workflows/test.yml)
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend && npm install
          cd ../backend && npm install
      
      - name: Run tests
        run: |
          cd frontend && npm test
          cd ../backend && npm test
      
      - name: Build frontend
        run: cd frontend && npm run build
```

---

**Elacare Testing Complete!** ✅🌾
