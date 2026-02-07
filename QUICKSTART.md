# Elacare Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you set up and run the Elacare Smart Farming Dashboard locally.

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **Firebase Account** - Create free at [firebase.google.com](https://firebase.google.com)
- **Terminal/Command Line** - PowerShell, CMD, or Bash

### Step 1: Setup Firebase Project (10 minutes)

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Create Project"
   - Name: `elacare`
   - Enable Google Analytics (optional)
   - Create

2. **Enable Services**
   - Click **Firestore Database** on the left
   - Click **Create Database**
   - Select **Start in production mode**
   - Select region close to you
   - Click **Create**

3. **Enable Authentication**
   - Click **Authentication** on left menu
   - Click **Get Started**
   - Choose **Email/Password**
   - Toggle **Enable** → **Save**

4. **Create Service Account (for Backend)**
   - Go to **Project Settings** (gear icon)
   - Click **Service Accounts** tab
   - Click **Generate New Private Key**
   - **Save the JSON file** to a secure location (e.g., Downloads folder)
   - **DO NOT share** this file—keep it private and secure

5. **Get Web Config (for Frontend)**
   - Go to **Project Settings** (gear icon)
   - Scroll down to "Your apps" section
   - Click the **Web app icon** (looks like `</>`), or create new web app if needed
   - You'll see a code snippet with Firebase configuration
   - Copy each value from the `firebaseConfig` object

### Step 2: Download and Extract Elacare

```bash
# Navigate to your projects folder
cd C:\Users\YourUsername\Documents

# Clone or download the elacare-web folder
# If you have it as ZIP, extract it here
cd elacare-web
```

### Step 3: Configure Backend

```bash
cd backend

# Create environment file
copy .env.example .env
```

**Now open the `.env` file in a text editor and fill it with:**

```env
PORT=3001
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT='PASTE_YOUR_JSON_KEY_HERE'
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
ESP32_API_KEY=sk_test_4eC39HqLyjWDarhtJXhpKj2Xx
CORS_ORIGIN=http://localhost:3000
```

#### 🔑 How to Add Your Firebase Service Account Key:

**Step 1: Find the Downloaded JSON File**
- When you clicked "Generate New Private Key" in Firebase, a `.json` file was downloaded
- Look in your **Downloads** folder (or wherever your browser saves files)
- It's usually named something like: `elacare-abc123-firebase-adminsdk-xyz-abc123.json`

**Step 2: Open the JSON File**
- Right-click the downloaded `.json` file
- Select "Open with" → Notepad (or any text editor)
- You should see something like this:
```json
{
  "type": "service_account",
  "project_id": "elacare-abc123",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...",
  ...
}
```

**Step 3: Copy the Entire Content**
- Select all text: `Ctrl+A`
- Copy it: `Ctrl+C`

**Step 4: Paste Into .env File**
- Open `backend/.env` in your text editor
- Replace `PASTE_YOUR_JSON_KEY_HERE` with your copied JSON
- **Keep it on ONE line** without any line breaks
- Result should look like:
```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"elacare-abc123",...}'
```

**Step 5: Complete the Rest**
- Replace `https://your-project.firebaseio.com` with your actual Firebase URL
- Fill in `ESP32_API_KEY` with a random strong password (any string, like: `super_secret_key_12345`)
- Save the `.env` file

#### ✅ Final .env Should Look Like:
```env
PORT=3001
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"elacare-abc123","private_key_id":"abc123...rest of json...}'
FIREBASE_DATABASE_URL=https://elacare-abc123.firebaseio.com
ESP32_API_KEY=super_secret_key_12345
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Security Warning:** 
- ✋ **NEVER** commit `.env` to Git
- ✋ **NEVER** share your private key
- ✋ **NEVER** push this file to GitHub
- ✋ **.env is already in .gitignore** (protected automatically)

### Step 4: Configure Frontend

```bash
cd ../frontend

# Create environment file
copy .env.local.example .env.local
```

**Now open the `.env.local` file in a text editor and fill it with your Firebase credentials:**

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### 📋 How to Copy Your Firebase Web Config:

**Step 1: Go to Firebase Console**
- Open [Firebase Console](https://console.firebase.google.com)
- Select your `elacare` project
- Click **Project Settings** (gear icon, top left)

**Step 2: Find Your Web App**
- Scroll down to "Your apps" section
- Click on your **Web app** (or create one if you haven't)
- You'll see code that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDC3zq4BUk6qt6mq7GDpjLg9fRVNSAaZPM",
  authDomain: "elacare-d3556.firebaseapp.com",
  projectId: "elacare-d3556",
  storageBucket: "elacare-d3556.firebasestorage.app",
  messagingSenderId: "120325186454",
  appId: "1:120325186454:web:170368631c0292322373b7",
  measurementId: "G-SEGZC1P4E2"
};
```

**Step 3: Copy Each Value**
Match each Firebase value to the .env.local variable:

| Firebase Config | .env.local Variable |
|---|---|
| `apiKey` | `REACT_APP_FIREBASE_API_KEY` |
| `authDomain` | `REACT_APP_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `REACT_APP_FIREBASE_PROJECT_ID` |
| `storageBucket` | `REACT_APP_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `REACT_APP_FIREBASE_APP_ID` |

**Step 4: Fill in .env.local**
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=AIzaSyDC3zq4BUk6qt6mq7GDpjLg9fRVNSAaZPM
REACT_APP_FIREBASE_AUTH_DOMAIN=elacare-d3556.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=elacare-d3556
REACT_APP_FIREBASE_STORAGE_BUCKET=elacare-d3556.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=120325186454
REACT_APP_FIREBASE_APP_ID=1:120325186454:web:170368631c0292322373b7
```

✅ **Save the `.env.local` file** - You're done with configuration!

### Step 5: Install Dependencies (5 minutes)

`npm install` downloads all the required libraries and tools for the project. It reads the `package.json` file and installs everything listed.

#### 🔧 Install Backend Dependencies

Open **PowerShell or Command Prompt** and run:

```bash
cd backend
npm install
```

**What you'll see:**
- It will download ~500+ packages
- Progress bar will show: `added 500 packages in 30s`
- Wait until it finishes completely ✅

#### 🔧 Install Frontend Dependencies

Open a **new PowerShell/Command Prompt window** (keep the first one open) and run:

```bash
cd frontend
npm install
```

**What you'll see:**
- It will download ~1300+ packages
- Progress bar will show: `added 1370 packages in 5m`
- Wait until it finishes completely ✅

#### ⚠️ About the Warnings & Vulnerabilities

You might see lots of **npm warn** messages and **npm audit report** with vulnerabilities. **This is NORMAL!** Here's why:

- ✅ React's build tool (`react-scripts`) has outdated dependencies
- ✅ These are transitive vulnerabilities (in dependencies of dependencies)
- ✅ They do NOT affect local development
- ✅ The app will work perfectly fine
- ✅ Your local machine is safe (these affect deployed web servers, not local dev)

**⛔ DO NOT run `npm audit fix --force`**
- It says "Will install react-scripts@0.0.0" (which breaks everything)
- This is a known issue with React, not your app

**What to do:**
- ✅ Just ignore the warnings and proceed to Step 6
- ✅ The app will run and work great locally
- ✅ When you deploy to production, use a platform that handles security (Vercel, Netlify handle this for you)

#### ✅ How to Check if Installation Worked

After both finish, you should see:
- ✅ No red error messages
- ✅ Both folders now have a `node_modules` folder (large folder with all dependencies)
- ✅ Both show `added XXX packages in XXs`

If you get a real error (red text), most common fix:
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

**Now proceed to Step 6!** 👇

### Step 6: Run the Application

**Terminal 1 - Start Backend**
```bash
cd backend
npm run dev
# Output: "🚀 Elacare Backend running on port 3001"
```

**Terminal 2 - Start Frontend**
```bash
cd frontend
npm start
# Should open http://localhost:3000 automatically
```

### Step 7: Test the Application

1. **Go to Signup**
   - Click "Sign Up"
   - Create account: `test@example.com` / `password123`
   - Should redirect to Dashboard

2. **View Dashboard**
   - See sensor cards with demo data
   - Green status = Optimal
   - Yellow/Red = Issues
   - Read Fertilizer Advice section

3. **Test Leaf Scanner**
   - Click "Leaf Health Check"
   - Allow camera permission
   - Take a photo or upload an image
   - View disease detection results

## 🔧 Troubleshooting

### "Cannot find module 'express'"
```bash
# Make sure you're in the backend folder
cd backend
npm install
```

### "REACT_APP_FIREBASE_API_KEY is not defined"
```bash
# Check .env.local file exists and has all values
# Restart frontend: Stop and run "npm start" again
```

### "Firestore connection refused"
- Check Firebase credentials are correct
- Verify internet connection
- Check Firestore is enabled in Firebase Console

### "No camera access"
- Chrome/Edge: Click camera icon in address bar → Allow
- Firefox: Settings → Privacy → Camera → Allow
- Mobile: App Permissions → Enable Camera

## 📱 Viewing on Mobile

To access from your phone/tablet:

1. **Find your computer's IP**
   ```powershell
   ipconfig
   # Look for "IPv4 Address: 192.168.x.x"
   ```

2. **Update Backend CORS**
   Edit `backend/.env`:
   ```
   CORS_ORIGIN=http://192.168.1.100:3000
   ```

3. **Access from Phone**
   - On same WiFi network as computer
   - Open browser and go to: `http://192.168.1.100:3000`
   - (Replace IP with your actual IP)

## 📊 Understanding the Dashboard

### Sensor Cards
- **Nitrogen (N)**: Green leaves, overall plant vigor
- **Phosphorus (P)**: Root development, flowering
- **Potassium (K)**: Disease resistance, fruit quality
- **pH**: Nutrient availability (6.0-7.5 optimal)
- **Boron (B)**: Flower and fruit development

### Status Indicators
- ✓ Optimal (Green) - Continue current practices
- ↓ Low (Yellow) - Need more of this nutrient
- ↑ High (Red) - Too much, reduce applications

### Fertilizer Advice
- Based on your current soil conditions
- Cardamom-specific recommendations
- Links soil nutrients to plant functions

## 🤖 Leaf Scanner Demo

The leaf scanner includes simulated AI that detects:
- **Healthy Leaf** - No action needed
- **Leaf Spot** - Apply fungicide, improve drainage
- **Thrips Damage** - Insecticide, increase nitrogen
- **Nutrient Deficiency** - Adjust soil nutrients

Results show confidence percentage and treatment plan.

## 🌐 Next Steps

### For Local Development (Right Now)

**You do NOT need Firebase Hosting for local testing.** Just run:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

Your app will be at `http://localhost:3000` ✅

### For Production Deployment (Later)

When you're ready to deploy:

- **Frontend** → Deploy to Vercel or Firebase Hosting
- **Backend** → Deploy to Railway or Heroku
- **Database** → Stay on Firebase (already hosted)

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete production setup guide.

### Firebase Hosting (Optional)

Firebase Hosting is mainly for static websites. If you want to use it:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Initialize (in frontend folder):
```bash
firebase init hosting
```

4. Build and deploy frontend:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

⚠️ **Note:** Firebase Hosting is for the **frontend only**. Your backend still needs to be on Railway/Heroku.

## 📚 Learn More

- [Frontend README](frontend/README.md) - React app details
- [Backend README](backend/README.md) - API documentation
- [Main README](README.md) - Full project overview
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)

## 🆘 Still Having Issues?

1. **Check logs in console** - Look for error messages
2. **Verify .env files** - Most issues are config-related
3. **Restart terminals** - Sometimes helps with port issues
4. **Clear browser cache** - Ctrl+Shift+Delete
5. **Check firebase console** - Ensure database is enabled

---

**Elacare is ready! Happy farming! 🌾**
