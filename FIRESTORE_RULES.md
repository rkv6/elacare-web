# Firestore Security Rules Setup

## Problem
Data is being successfully stored in Firebase by the backend, but the frontend cannot display it because of missing Firestore security rules.

## Solution
Set these Firestore security rules in the Firebase Console:

### Steps
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project `elacare-d3556`
3. Navigate to **Firestore Database** → **Rules**
4. Replace all rules with the code below
5. Click **Publish**

### Firestore Rules Code

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write their farm data
    match /farms/{farmId} {
      allow read, write: if request.auth != null;
      
      // Sensors subcollection
      match /sensors/{document=**} {
        allow read, write: if request.auth != null;
      }
      
      // Sensor history subcollection
      match /sensorHistory/{document=**} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Why This Is Needed

- **Backend**: Uses Firebase Admin SDK (has full access - no rules apply)
- **Frontend**: Uses regular Firebase SDK (requires explicit permission)
  - Reading sensor data: `db.collection('farms').doc(farmId).collection('sensors').doc('current')`
  - Reading history: `db.collection('farms').doc(farmId).collection('sensorHistory')`
  - Need permission: `allow read` for authenticated users

## Testing
After setting the rules:
1. Reload the frontend (http://localhost:5173)
2. Make sure you're logged in
3. Sensor data should appear on the Dashboard
