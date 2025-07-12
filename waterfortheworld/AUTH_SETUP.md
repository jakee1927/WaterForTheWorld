# Authentication System Setup Guide

This guide will help you set up the authentication system for the WaterForTheWorld application.

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. In the project dashboard, click on the web app icon (</>) to add a new web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Environment Variables

Create a `.env.local` file in the root of your project and add the following variables with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Authentication Methods

1. Go to the Firebase Console
2. Navigate to Authentication > Sign-in method
3. Enable "Email/Password" and "Google" sign-in methods

## Firestore Rules

Set up the following security rules in Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }
  }
}
```

## Testing the Authentication

1. Run the development server:
   ```bash
   npm run dev
   ```
2. Visit `http://localhost:3000/auth/signup` to create a new account
3. After signing up, you'll be redirected to the dashboard
4. You can sign out using the button in the navigation bar

## Features

- Email/Password authentication
- User profile management
- Protected routes
- Responsive navigation
- Droplet tracking system
- Certificate generation

## Troubleshooting

- If you encounter any issues with authentication, check the browser console for error messages
- Ensure all environment variables are correctly set
- Make sure Firestore rules are properly configured
- Check the Firebase Console's Authentication and Firestore sections for any errors
