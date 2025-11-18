# 🚀 DEPLOYMENT - Step by Step Guide

## Current Status
- ✅ Code pushed to GitHub: https://github.com/manav-bhullar/campus-marketplace.git
- ✅ Local development working (localhost:5173 & localhost:5001)
- ✅ MongoDB Atlas configured
- ✅ Google OAuth configured (for localhost)

---

## PART 1: Deploy Backend to Render 

### Step 1.1: Go to Render and Create Account
1. Open https://render.com
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"** (easier)
4. Authorize GitHub
5. Create account

### Step 1.2: Create Backend Web Service on Render

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** for GitHub
4. Authorize GitHub
5. Find and select: `campus-marketplace` repository
6. Click **"Connect"**

### Step 1.3: Configure Deployment Settings

Fill in the following:

```
Name:                  campus-market-api
Region:                Choose closest to you
Branch:                main
Root Directory:        server
Runtime:               Node
Build Command:         npm install
Start Command:         npm start
Autoscroll logs:       Checked
```

**Important**: Set these in the order they appear on the form!

### Step 1.4: Add Environment Variables

Before clicking "Deploy", you MUST add environment variables. Look for **"Environment"** section on the same page.

Click **"Add Environment Variable"** and add each one:

**Option A: Copy from your local .env (RECOMMENDED)**

In VS Code, open `server/.env` and copy these values:

```
MONGODB_URI = your_mongodb_uri_here
JWT_SECRET = your_jwt_secret_key_here
GOOGLE_CLIENT_ID = your_google_client_id_here
GOOGLE_CLIENT_SECRET = your_google_client_secret_here
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
NODE_ENV = production
FRONTEND_URL = https://your-vercel-url.vercel.app
```

**Add each one individually in Render's form:**

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/campus-market?retryWrites=true&w=majority` |
| `JWT_SECRET` | (copy from your local .env) |
| `GOOGLE_CLIENT_ID` | (copy from your local .env) |
| `GOOGLE_CLIENT_SECRET` | (copy from your local .env) |
| `CLOUDINARY_CLOUD_NAME` | (copy from your local .env) |
| `CLOUDINARY_API_KEY` | (copy from your local .env) |
| `CLOUDINARY_API_SECRET` | (copy from your local .env) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app` (add this AFTER Vercel deploy) |

### Step 1.5: Create Web Service

1. Scroll down
2. Click **"Create Web Service"**
3. Wait for deployment (5-10 minutes)
4. You'll see: "Your service is live" with a URL like:
   ```
   https://campus-market-api.onrender.com
   ```

✅ **Backend is now deployed!**

### Step 1.6: Keep Backend Alive (Important!)

Render's free tier puts services to sleep after 15 minutes of inactivity. To keep it running:

**Option A: Upgrade to Paid** ($7/month)
- Click "Upgrade" in service settings

**Option B: Keep It Free**
- Use a monitoring service like Uptime Robot
- Ping your API every 10 minutes (free tier available)

---

## PART 2: Deploy Frontend to Vercel

### Step 2.1: Go to Vercel and Create Account
1. Open https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize GitHub
5. Create account

### Step 2.2: Import Project to Vercel

1. Click **"Add New"** button
2. Select **"Project"**
3. Click **"Import Git Repository"**
4. Find and select: `campus-marketplace`
5. Click **"Import"**

### Step 2.3: Configure Project

Fill in the following:

```
Project Name:           campus-market
Framework Preset:       Vite
Root Directory:         client
Build Command:          npm run build
Output Directory:       dist
Install Command:        npm install
```

### Step 2.4: Add Environment Variables

Before clicking "Deploy", add environment variables.

Look for **"Environment Variables"** section.

Add each one:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://campus-market-api.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | (copy from your local .env) |

**Note**: Replace `campus-market-api` with your actual Render service name if different.

### Step 2.5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll see: "Congratulations! Your project has been successfully deployed" with a URL like:
   ```
   https://campus-market.vercel.app
   ```

✅ **Frontend is now deployed!**

---

## PART 3: Update Google OAuth for Production

### Step 3.1: Get Your Production URLs

After both deployments, you have:
- **Backend**: `https://campus-market-api.onrender.com`
- **Frontend**: `https://campus-market.vercel.app`

### Step 3.2: Update Google Cloud Console

1. Go to https://console.cloud.google.com
2. Select project: **Campus marketplace**
3. Go to **Credentials**

### Step 3.3: Update OAuth 2.0 Client ID

1. Find your **Web application** client ID
2. Click on it to edit
3. Update **"Authorized JavaScript origins"** to:
   ```
   https://campus-market.vercel.app
   http://localhost:5173
   http://localhost:3000
   ```
4. Update **"Authorized redirect URIs"** to:
   ```
   https://campus-market.vercel.app/
   http://localhost:5173/
   http://localhost:3000/
   ```
5. Click **"Save"**

### Step 3.4: Update Branding (Optional but Recommended)

1. Go to **Branding** tab
2. In **"Authorized domains"** add:
   ```
   campus-market.vercel.app
   ```
3. Click **"Save"**

---

## PART 4: Update Backend FRONTEND_URL

Now that you have your Vercel URL, update Render:

1. Go to https://dashboard.render.com
2. Click on **campus-market-api** service
3. Go to **"Settings"** tab
4. Find **"Environment"** section
5. Edit **`FRONTEND_URL`** variable
6. Change from `http://localhost:5173` to:
   ```
   https://campus-market.vercel.app
   ```
7. Service will redeploy automatically

---

## PART 5: Test Production Deployment

### Test 1: Check Frontend
1. Open https://campus-market.vercel.app
2. You should see the login page

### Test 2: Try Google OAuth Login
1. Click **"Sign in with Google"**
2. Sign in with your **@thapar.edu** email
3. You should be logged in!

### Test 3: List Items
1. Click **"Browse Items"** (or equivalent)
2. You should see items from production database

### Test 4: Upload Image
1. Try to create a new item
2. Upload an image
3. Verify image appears (hosted on Cloudinary)

### Test 5: Add Review
1. Click on an item
2. Add a review/rating
3. Verify it saves and displays

✅ **If all tests pass, you're deployed!**

---

## PRODUCTION URLs

```
🌐 Frontend:  https://campus-market.vercel.app
🔌 Backend:   https://campus-market-api.onrender.com
💾 Database:  MongoDB Atlas (cloud)
📧 OAuth:     Google (configured)
📸 Images:    Cloudinary (configured)
```

---

## Troubleshooting

### Issue: Backend returns 503 error
**Solution**: 
- Render free tier goes to sleep. Upgrade to paid or use Uptime Robot to keep it alive
- Check backend logs in Render dashboard for errors

### Issue: Google OAuth login fails
**Solution**:
- Verify `VITE_API_URL` is set correctly in Vercel env vars
- Check Google Cloud Console has correct redirect URIs
- Clear browser cache and cookies
- Check browser console for error messages

### Issue: Images don't upload
**Solution**:
- Verify Cloudinary credentials in Render backend env vars
- Check Cloudinary API key is active
- Verify CORS allows image uploads

### Issue: Can't see items from database
**Solution**:
- Verify `MONGODB_URI` is correct in Render env vars
- Check MongoDB Atlas IP whitelist includes Render IPs (usually `0.0.0.0/0` for free tier)
- Check database `campus-market` exists in MongoDB Atlas

### Issue: Deploy fails on Render/Vercel
**Solution**:
- Check build logs in dashboard
- Verify all environment variables are set
- Ensure root directory is correct (`server` for backend, `client` for frontend)
- Try redeploying from dashboard

---

## Next Steps

1. ✅ Deploy backend to Render (this step)
2. ✅ Deploy frontend to Vercel (this step)
3. ✅ Update Google OAuth (this step)
4. ✅ Test production (this step)
5. **Monitor & maintain**:
   - Monitor backend performance
   - Monitor uptime
   - Handle errors and bugs
   - Scale if needed

---

## Support

- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **MongoDB Support**: https://www.mongodb.com/support
- **Google Support**: https://support.google.com/cloud

---

**Ready to deploy? Start with Step 1.1!** 🚀
