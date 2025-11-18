# 🚀 Campus Market - Production Deployment Guide

## Overview
This guide covers deploying the Campus Market MERN application to production:
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas (already in cloud)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

#### 1.1 Update `server/.env` for Production
Ensure your `.env` file has all required variables. Copy from your local `.env` file:

```properties
# MongoDB Atlas Connection (Production)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER

# JWT Secret for Token Authentication
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Node Environment
NODE_ENV=production
PORT=10000
```

**⚠️ Important**: Store these credentials securely in Render's environment variable settings, NOT in git.

#### 1.2 Create `.gitignore` for Backend
```bash
cd server
echo "node_modules/
.env
.env.local
.DS_Store
*.log
dist/
build/" >> .gitignore
```

#### 1.3 Update `server/package.json` (add start script)
Make sure your `package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seed.js"
  }
}
```

#### 1.4 Update `server/server.js` for Production CORS

Your CORS should allow the production frontend URL. Update line 20-26:

```javascript
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true,
  })
);
```

---

### Step 2: Deploy Backend to Render

1. **Sign up on Render**: https://render.com/
   - Use GitHub account (recommended) or email

2. **Create New Web Service**:
   - Click "New" → "Web Service"
   - Select "Build and deploy from a Git repository"

3. **Connect GitHub Repository**:
   - Click "Connect account" and authorize GitHub
   - Select your repository: `Devanshu2k5ds/ucs503p-202526odd-dmas`
   - Select "main" branch

4. **Configure Deployment**:
   - **Name**: `campus-market-api`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

5. **Environment Variables** (in Render dashboard):
   Add the following (copy from your local `.env` file):
   ```
   MONGODB_URI=your_mongodb_uri_here
   
   JWT_SECRET=your_jwt_secret_key_here
   
   GOOGLE_CLIENT_ID=your_google_client_id_here
   
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   CLOUDINARY_NAME=your_cloudinary_name
   
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   
   NODE_ENV=production
   
   FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
   ```

   **⚠️ Security**: Never commit secrets to git. Always add them in the platform's environment variable settings.

6. **Deploy**: Click "Create Web Service"
   - Render will build and deploy automatically
   - Wait for deployment to complete (~5 mins)
   - You'll get a URL like: `https://campus-market-api.onrender.com`

7. **Keep Backend Alive** (Render free tier goes to sleep):
   - Upgrade to Paid ($7/month) to keep it running 24/7, OR
   - Use a monitoring service to ping it every 15 minutes

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

#### 1.1 Update `client/.env.production`
Create a new file: `client/.env.production`

```properties
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### 1.2 Update `client/.env.development`
Keep this for local development:

```properties
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### 1.3 Ensure `client/vite.config.js` is correct
```javascript
export default {
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
};
```

#### 1.4 Create `client/.gitignore`
```bash
cd client
echo "node_modules/
dist/
.env.local
.DS_Store
*.log" >> .gitignore
```

---

### Step 2: Deploy Frontend to Vercel

1. **Sign up on Vercel**: https://vercel.com/
   - Use GitHub account (recommended)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Click "Import Git Repository"
   - Select: `Devanshu2k5ds/ucs503p-202526odd-dmas`

3. **Configure Project**:
   - **Project Name**: `campus-market`
   - **Framework**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

5. **Deploy**: Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://campus-market.vercel.app`

---

## Part 3: Update Google OAuth for Production

1. **Go to Google Cloud Console**:
   - Project: "Campus marketplace"
   - Go to "Credentials"

2. **Update OAuth 2.0 Client ID**:
   - Click on your Web application client ID
   - Update "Authorized JavaScript origins":
     ```
     https://campus-market.vercel.app
     http://localhost:5173
     http://localhost:3000
     ```
   - Update "Authorized redirect URIs":
     ```
     https://campus-market.vercel.app/
     http://localhost:5173/
     ```
   - Save

3. **Go to Branding tab**:
   - Add `campus-market.vercel.app` to "Authorized domains"
   - Save

---

## Part 4: Update MongoDB Atlas Network Access (Optional but Recommended)

For security, you should restrict which IPs can access MongoDB:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Go to Network Access**
3. **Current Settings**: `0.0.0.0/0` (allows all IPs)
4. **For Production**: Add specific IPs:
   - Render uses dynamic IPs, so keep `0.0.0.0/0` or use IP access list with Render's IPs
   - Recommended: Keep `0.0.0.0/0` for development

---

## Part 5: Verify Production Deployment

1. **Test Frontend**: Open https://campus-market.vercel.app
2. **Try Login**: Use your @thapar.edu email
3. **Browse Items**: Verify data loads from production backend
4. **Create Item**: Upload and test full functionality
5. **Add Review**: Verify reviews work

---

## Deployment Status Checklist

- [ ] Backend deployed to Render: `https://campus-market-api.onrender.com`
- [ ] Frontend deployed to Vercel: `https://campus-market.vercel.app`
- [ ] Google OAuth configured for production URLs
- [ ] Environment variables set on both platforms
- [ ] Login works with @thapar.edu email
- [ ] Image upload works (Cloudinary integration)
- [ ] Database operations work (MongoDB Atlas)
- [ ] CORS configured properly

---

## Troubleshooting Deployment Issues

### Issue: Backend returns 503 error
**Solution**: Render free tier goes to sleep. Upgrade to paid ($7/month) or set up a monitoring service to keep it awake.

### Issue: Google OAuth login fails on production
**Solution**: 
- Verify redirect URLs are in Google Cloud Console
- Check browser console for error messages
- Ensure `.env.production` has correct `VITE_API_URL`

### Issue: Images don't upload
**Solution**:
- Verify Cloudinary credentials in backend `.env`
- Check Cloudinary API key is active
- Verify CORS allows image requests

### Issue: MongoDB connection fails on Render
**Solution**:
- Verify `MONGODB_URI` is correct in Render env vars
- Check MongoDB Atlas IP whitelist includes Render IPs
- Verify user has correct permissions

### Issue: Vite build fails
**Solution**:
- Check `client/vite.config.js` is correct
- Verify all npm packages installed
- Run `npm run build` locally first to test

---

## Next Steps (Optional Enhancements)

1. **Custom Domain**:
   - Add custom domain to Vercel (e.g., `campus-market.com`)
   - Add DNS records for custom domain

2. **SSL/TLS Certificate**:
   - Both Vercel and Render provide free SSL certificates
   - Already automatically configured

3. **Database Backups**:
   - Set up MongoDB Atlas automated backups
   - Enable point-in-time recovery

4. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API performance (NewRelic)
   - Set up uptime monitoring (Uptime Robot)

5. **Email Notifications**:
   - Add email service for order confirmations
   - Send notifications when items are listed/sold

---

## Production URLs (After Deployment)

```
Frontend:  https://campus-market.vercel.app
Backend:   https://campus-market-api.onrender.com
Database:  MongoDB Atlas (cluster0)
```

---

## Support

For deployment issues:
- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/support

---

**Happy Deploying! 🚀**
