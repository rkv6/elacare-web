# 🔑 Service Account Configuration Guide

## ✅ Great! You've created the service account successfully!

I can see your service account **"elacare-gemini-service"** with key ID: `811f93e46ed80af139dd0ee33f9e96b9ddab9f11`

## 📥 Next Steps - Download the JSON File

1. **In your Google Cloud Console (Keys tab):**
   - Click on the key: `811f93e46ed80af139dd0ee33f9e96b9ddab9f11`
   - Click **"Download"** or the download icon (⬇️)
   - Save the JSON file as `service-account.json`

2. **The downloaded JSON will look like:**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "811f93e46ed80af139dd0ee33f9e96b9ddab9f11",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...long key here...\n-----END PRIVATE KEY-----\n",
     "client_email": "elacare-gemini-service@your-project-id.iam.gserviceaccount.com",
     "client_id": "123456789...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
   }
   ```

## 🛠️ Configuration Options

### Option 1: JSON File (Recommended)
```bash
# Save your downloaded JSON file to:
backend/config/service-account.json
```

### Option 2: Environment Variables
```bash
# Copy backend/.env.example to backend/.env
# Then fill in the values from your JSON file:

GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=811f93e46ed80af139dd0ee33f9e96b9ddab9f11
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=elacare-gemini-service@your-project-id.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
```

## 🚀 After Configuration

Your ElaCare dashboard will automatically use secure service account authentication!

**Test it:**
```bash
cd backend
PORT=5000 npm run dev
```

The backend should show: **"✅ Gemini AI initialized with service account"**

---
**Need the JSON file downloaded? Go back to Google Cloud Console → Keys tab → Click your key → Download ⬇️**