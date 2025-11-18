# ⚡ QUICK DEPLOYMENT REFERENCE

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub: https://github.com/manav-bhullar/campus-marketplace.git
- [ ] Have your `.env` file open (for copying credentials)
- [ ] Render account created
- [ ] Vercel account created

---

## 🔧 Values You'll Need to Copy

From `server/.env`, copy these values:

```
MONGODB_URI = 
JWT_SECRET = 
GOOGLE_CLIENT_ID = 
GOOGLE_CLIENT_SECRET = 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
```

---

## 📍 Step-by-Step Deployment

### BACKEND (Render) - 5 minutes

1. Go to https://render.com → Sign up with GitHub
2. Click "New" → "Web Service"
3. Connect & select `campus-marketplace` repo
4. Fill in:
   - Name: `campus-market-api`
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables (from your .env)
6. Click "Create Web Service"
7. **Wait for "Your service is live"** ✅

**Your Backend URL**: `https://campus-market-api.onrender.com`

---

### FRONTEND (Vercel) - 5 minutes

1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New" → "Project" → "Import Git Repository"
3. Select `campus-marketplace`
4. Fill in:
   - Project Name: `campus-market`
   - Root Directory: `client`
   - Build: `npm run build`
5. Add environment variables:
   - `VITE_API_URL` = `https://campus-market-api.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID` = (from your .env)
6. Click "Deploy"
7. **Wait for "Congratulations"** ✅

**Your Frontend URL**: `https://campus-market.vercel.app`

---

### GOOGLE OAUTH - 2 minutes

1. Go to https://console.cloud.google.com
2. Select "Campus marketplace" project
3. Go to "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Update "Authorized redirect URIs":
   - `https://campus-market.vercel.app/`
   - `http://localhost:5173/`
6. Click "Save"

---

## ✅ Test It Works

1. Open https://campus-market.vercel.app
2. Click "Sign in with Google"
3. Use your @thapar.edu email
4. Try browsing items
5. Try uploading an item
6. Try adding a review

---

## 🎯 Production URLs

```
Frontend:  https://campus-market.vercel.app
Backend:   https://campus-market-api.onrender.com
GitHub:    https://github.com/manav-bhullar/campus-marketplace
```

---

## 💡 Important Notes

- **Render Free Tier**: Service sleeps after 15 min inactivity
  - Solution: Upgrade to $7/month OR use Uptime Robot
  
- **Keep Backend Alive**:
  - Go to Uptime Robot (free)
  - Create monitor to ping backend every 10 mins
  
- **Never Commit Secrets**:
  - Only use environment variables on platforms
  - Keep `.env` in `.gitignore`

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| 503 Backend Error | Render service asleep - upgrade or use Uptime Robot |
| Google login fails | Check Google Console has correct redirect URIs |
| Images don't upload | Verify Cloudinary creds in Render env vars |
| Can't see items | Check MongoDB connection string in Render |
| Deploy fails | Check build logs in Render/Vercel dashboard |

---

**Full guide**: See `DEPLOYMENT_STEPS.md` for detailed instructions

**Good luck! 🚀**
