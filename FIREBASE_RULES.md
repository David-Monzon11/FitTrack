# Firebase Realtime Database Rules

To fix the "Permission denied" error when creating goals, you need to update your Firebase Realtime Database rules.

## Steps to Fix:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project (`fittrack-ab748`)
3. Click on "Realtime Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the rules with the following:

```json
{
  "rules": {
    "UsersAuthList": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "HealthData": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "Goals": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "StepSessions": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

6. Click "Publish" to save the rules

## What These Rules Do:

- **UsersAuthList**: Users can only read/write their own profile data
- **HealthData**: Users can only read/write their own health data
- **Goals**: Users can only read/write their own goals
- **StepSessions**: Users can only read/write their own step tracking sessions

All rules require authentication (`auth.uid`) and ensure users can only access their own data.

## Alternative: Test Mode (Development Only)

⚠️ **WARNING: Only use for development, never for production!**

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

This allows any authenticated user to read/write any data. Use only during development.
