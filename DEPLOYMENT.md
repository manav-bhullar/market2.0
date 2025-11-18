# Campus Market - Deployment Guide

This guide covers deploying Campus Market to production using Vercel (frontend) and Render (backend).

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas cluster created and connection tested
- [ ] Google OAuth credentials obtained
- [ ] Cloudinary account set up
- [ ] Code pushed to GitHub (public or private repo)
- [ ] Frontend `.env` configured
- [ ] Backend `.env` configured

## 🚀 Frontend Deployment on Vercel

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Choose "Import Git Repository"

### Step 3: Configure Project
1. **Framework Preset**: Select "Vite"
2. **Root Directory**: Select `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 4: Add Environment Variables
Click "Add Environment Variables" and add:

```
VITE_API_URL=https://campus-market-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete (~2-3 minutes)
- Your frontend URL will be displayed (e.g., `https://campus-market.vercel.app`)

### Step 6: Update Backend CORS
Go to backend deployment and update `FRONTEND_URL` to your Vercel URL.

---

## 🛠️ Backend Deployment on Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize GitHub access

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect to GitHub repository
3. Select your repo

### Step 3: Configure Service
1. **Name**: `campus-market-api`
2. **Environment**: `Node`
3. **Region**: Choose closest to users (e.g., `Oregon`)
4. **Branch**: `main`
5. **Build Command**: `cd server && npm install`
6. **Start Command**: `cd server && npm start`

### Step 4: Add Environment Variables
Add these in Render dashboard under "Environment":

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-market?retryWrites=true&w=majority
JWT_SECRET=use_a_strong_random_string_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://campus-market.vercel.app
PORT=5000
NODE_ENV=production
```

### Step 5: Deploy
- Click "Create Web Service"
- Render will automatically deploy
- Wait for "Your service is live" message
- Your backend URL will be displayed (e.g., `https://campus-market-api.onrender.com`)

### Step 6: Update Frontend API URL
1. Go to Vercel dashboard
2. Go to Settings → Environment Variables
3. Update `VITE_API_URL` to your Render backend URL
4. Redeploy frontend (it will auto-redeploy)

---

## 🔑 Getting Required Credentials

### MongoDB Atlas (Free Tier)

**Create Database:**
1. Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Create an Account"
3. Create Organization → Create Project
4. Click "Build a Database"
5. Choose "Shared" (free tier)
6. Select region (closest to your users)
7. Click "Create Cluster"

**Create Database User:**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Give permissions to read/write

**Get Connection String:**
1. Go to "Database"
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string
5. Replace `<username>` and `<password>` with your credentials

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/campus-market?retryWrites=true&w=majority
```

**Allow IP Access:**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allows all IPs, OK for dev/prod with authentication)

---

### Google OAuth Credentials

**Create OAuth 2.0 Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (name: `Campus Market`)
3. Enable "Google+ API"
4. Go to "Credentials"
5. Click "Create Credentials" → "OAuth 2.0 Client ID"
6. Choose "Web application"
7. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://campus-market.vercel.app
   ```
8. Add **Authorized redirect URIs**:
   ```
   http://localhost:5173
   https://campus-market.vercel.app
   ```
9. Copy Client ID and Client Secret

---

### Cloudinary (Free Tier)

**Create Account & Get Credentials:**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up (free account)
3. Go to "Dashboard"
4. Copy:
   - **Cloud Name**
   - **API Key**
5. Go to "Settings" → "API Keys"
6. Copy **API Secret**

**Optional - Create Upload Preset (for unsigned uploads):**
1. Go to "Settings" → "Upload"
2. Click "Add upload preset"
3. Set "Unsigned" mode (allows upload without auth token)
4. Save preset name (use in code if needed)

---

## 🔒 Security Best Practices

### For Production Deployment:

1. **JWT_SECRET**
   - Use a long, random string (50+ characters)
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Google OAuth**
   - Restrict redirect URIs to your domain only
   - Don't share `GOOGLE_CLIENT_SECRET` publicly

3. **MongoDB**
   - Use strong passwords for database user
   - Create separate user roles (production vs development)
   - Whitelist only your Render IP (if possible)

4. **Cloudinary**
   - Keep `API_SECRET` private (never expose in frontend)
   - Use signed URLs for sensitive uploads

5. **CORS Configuration**
   - Set specific `FRONTEND_URL` (not wildcard)
   - Use `credentials: true` only when needed

---

## 🧪 Testing Production Deployment

### 1. Check Backend Health
```bash
curl https://campus-market-api.onrender.com/api/health
# Should return: {"message":"Campus Market API is running!"}
```

### 2. Test Google Login
- Visit `https://campus-market.vercel.app/login`
- Attempt login with @thapar.edu email
- Check if redirected to home page after login

### 3. Test Item Creation
- Create new item with image
- Verify image uploads to Cloudinary
- Check item appears in home listing

### 4. Test Database
- Create review on an item
- Verify review appears for other users
- Check seller rating updates

### 5. Monitor Logs
**Vercel Frontend Logs:**
- Click "Deployments" → Latest deployment → "Logs"

**Render Backend Logs:**
- Click on Web Service → "Logs" tab

---

## 📊 Production Monitoring

### Monitor Backend (Render)
- Go to Service dashboard
- Check "Metrics" for CPU, Memory, Requests
- Set up alerts for downtime

### Monitor Frontend (Vercel)
- Go to "Analytics" dashboard
- Check page load times, errors
- Review deployment history

### Monitor Errors
- Check application logs regularly
- Set up email alerts for crashes
- Monitor database performance

---

## 🔄 CI/CD Pipeline (Optional - GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl https://api.render.com/deploy/srv-...
        env:
          RENDER_DEPLOY_KEY: ${{ secrets.RENDER_DEPLOY_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## ⚠️ Common Issues & Solutions

### "Render spins down after 15 minutes of inactivity"
- **Solution**: Use Render's Cron Job to ping `/api/health` every 14 minutes
- Alternative: Upgrade to paid plan for always-on service

### "CORS errors after deployment"
- **Solution**: Update `FRONTEND_URL` in backend `.env`
- Redeploy backend after updating

### "Images not loading on production"
- **Solution**: Verify Cloudinary API credentials
- Check image URL format and accessibility

### "Database connection timeout"
- **Solution**: Whitelist Render IP in MongoDB Atlas
- Check MongoDB user password (special chars cause issues)

---

## 📈 Scaling Tips

1. **Database**: Upgrade MongoDB tier if data exceeds 500GB
2. **Backend**: Upgrade Render plan if requests exceed capacity
3. **Frontend**: Vercel automatically scales
4. **Images**: Cloudinary handles scaling automatically

---

## 🎉 Deployment Checklist

- [ ] Backend deployed on Render ✅
- [ ] Frontend deployed on Vercel ✅
- [ ] All environment variables configured ✅
- [ ] Google OAuth working in production ✅
- [ ] Images uploading to Cloudinary ✅
- [ ] Database connection stable ✅
- [ ] Email notifications working ✅
- [ ] Monitoring alerts set up ✅
- [ ] SSL/HTTPS enabled ✅
- [ ] Tested with production data ✅

---

**Your app is now live in production! 🚀**
