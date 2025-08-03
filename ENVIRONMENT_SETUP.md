# Environment Setup Guide

This guide explains how to set up environment variables and API keys for the IntelliGuide project.

## Required Environment Variables

### 1. GEMINI_API_KEY
- **Purpose**: Used for AI chat functionality
- **How to get**: 
  1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
  2. Create a new API key
  3. Copy the key

### 2. DATABASE_URL
- **Purpose**: Database connection string
- **How to get**: 
  1. Set up a Neon database at [neon.tech](https://neon.tech)
  2. Copy the connection string from your dashboard

### 3. Firebase Variables (Optional)
- **Purpose**: Firebase integration for data storage
- **How to get**: 
  1. Go to [Firebase Console](https://console.firebase.google.com/)
  2. Create a new project or select existing one
  3. Go to Project Settings > Service Accounts
  4. Generate new private key
  5. Use the values from the downloaded JSON file

## Setup Methods

### Method 1: Environment Variables (Recommended)

#### Windows PowerShell:
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
$env:DATABASE_URL="your_actual_database_url_here"
```

#### Windows Command Prompt:
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
set DATABASE_URL=your_actual_database_url_here
```

#### Linux/Mac:
```bash
export GEMINI_API_KEY="your_actual_api_key_here"
export DATABASE_URL="your_actual_database_url_here"
```

### Method 2: .env File (Most Common)

Create a `.env` file in the project root:

```env
# AI Configuration
GEMINI_API_KEY=your_actual_api_key_here

# Database Configuration
DATABASE_URL=your_actual_database_url_here

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_CLIENT_CERT_URL=your_firebase_client_cert_url

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Method 3: Update config.js

Edit the `config.js` file in the project root and replace the placeholder values with your actual API keys:

```javascript
export const config = {
  GEMINI_API_KEY: "your_actual_gemini_api_key",
  DATABASE_URL: "your_actual_database_url",
  // ... other config
};
```

## Verification

After setting up your environment variables, run the development server:

```bash
npm run dev
```

The server will validate your configuration and show any missing variables.

## Security Notes

1. **Never commit API keys to version control**
2. The `.env` file and `config.js` are already added to `.gitignore`
3. Use environment variables in production deployments
4. Consider using a secrets management service for production

## Troubleshooting

### "Configuration validation failed"
- Check that all required variables are set
- Verify API keys are valid and not placeholder values

### "DATABASE_URL must be set"
- Ensure your database URL is correctly formatted
- Test the connection string separately

### "Firebase environment variables missing"
- This is normal if you're not using Firebase
- The app will fall back to in-memory storage

## Production Deployment

For production deployments, set environment variables through your hosting platform:

- **Vercel**: Use the Environment Variables section in your project settings
- **Netlify**: Use the Environment Variables section in your site settings
- **Railway**: Use the Variables tab in your project
- **Heroku**: Use `heroku config:set VARIABLE_NAME=value` 