# 🚀 Quick Start Guide - Campus Market

Get up and running in 5 minutes!

## 📋 What You'll Need

- Node.js installed
- MongoDB Atlas account (free tier)
- Google OAuth credentials
- Cloudinary account
- Text editor/IDE

## ⚡ 5-Minute Setup

### 1️⃣ Clone and Install (1 min)
```bash
# From project root
chmod +x setup.sh
./setup.sh
```

### 2️⃣ Configure Backend (2 min)

**Edit `server/.env`:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campus-market
JWT_SECRET=your_random_secret_key_min_32_chars
GOOGLE_CLIENT_ID=your_google_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**How to get credentials:**
- **MongoDB**: [atlas.mongodb.com](https://atlas.mongodb.com) → Create free cluster
- **Google OAuth**: [console.cloud.google.com](https://console.cloud.google.com)
- **Cloudinary**: [cloudinary.com](https://cloudinary.com) → Sign up free

### 3️⃣ Configure Frontend (1 min)

**Edit `client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_id.apps.googleusercontent.com
```

### 4️⃣ Start Servers (1 min)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

✅ **You're Done!** Open http://localhost:5173 in your browser

---

## 🔧 What's Included

### Frontend ✨
- 5 pages (Home, Login, ItemDetails, PostItem, Profile)
- 3 reusable components (Navbar, ItemCard, ReviewSection)
- Search & filter functionality
- Image upload
- Google OAuth login
- Tailwind CSS styling

### Backend 🛠️
- 3 models (User, Item, Review)
- 7 API endpoints (auth, items CRUD, reviews)
- Image upload to Cloudinary
- JWT authentication
- MongoDB integration

### Database 📊
- Pre-seeded with dummy data
- 3 sample users, 6 sample items, 6 sample reviews

---

## 📝 Quick API Examples

### Get All Items
```bash
curl http://localhost:5000/api/items?search=book&category=Books&sort=newest
```

### Create Item (requires auth)
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Item" \
  -F "price=500" \
  -F "category=Books" \
  -F "description=Great item" \
  -F "image=@image.jpg"
```

### Add Review
```bash
curl -X POST http://localhost:5000/api/reviews/ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Great!"}'
```

---

## 🧪 Test Features

### 1. Login with Google
- Click "Login" on http://localhost:5173
- Must use @thapar.edu email
- First time creates account automatically

### 2. Post an Item
- Click "Post Item" after login
- Fill in details and upload image
- Item appears on home page

### 3. View Item Details
- Click on any item card
- See seller info and reviews
- Add your own review (1-5 stars)

### 4. Check Profile
- Click your profile in navbar
- See your listings and seller stats
- Edit or delete your items

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Only @thapar.edu allowed" | Use Google account with @thapar.edu email |
| "Database connection failed" | Check MongoDB URI and whitelist your IP |
| "Images not uploading" | Verify Cloudinary credentials |
| "Google login fails" | Check Google OAuth Client ID matches |
| "API not found" | Ensure backend is running on port 5000 |

---

## 📚 File Structure Quick Reference

```
├── server/
│   ├── models/           # Database schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & upload
│   ├── server.js         # Main server file
│   └── .env              # Configuration
│
├── client/
│   ├── src/
│   │   ├── pages/        # Route pages
│   │   ├── components/   # Reusable UI
│   │   ├── services/     # API calls
│   │   ├── context/      # Auth state
│   │   ├── App.jsx       # Main component
│   │   └── index.css     # Styles
│   └── .env              # Configuration
│
├── README.md             # Full documentation
├── DEPLOYMENT.md         # Deploy to production
└── setup.sh              # Setup script
```

---

## 🚀 Next Steps

1. **Explore the code** - Understand the architecture
2. **Add features** - Wishlist, messaging, filters
3. **Customize UI** - Change colors/layout
4. **Deploy** - Read DEPLOYMENT.md for production
5. **Learn** - Study authentication, API design, database

---

## 💡 Tips & Tricks

### Speed Up Development
- Use Chrome DevTools for frontend debugging
- Use VS Code REST Client for API testing
- Use Mongo Compass for database visualization

### Testing Without Google OAuth
- Skip auth middleware in dev (see server.js comments)
- Create test tokens with JWT debugger

### Database Inspection
- Install MongoDB Compass
- Connect to your MongoDB URI
- Browse collections and data

### Hot Reload
- Frontend: Automatically reloads on file save
- Backend: Use `nodemon` (already configured)

---

## 📖 Learn More

- **Frontend**: Read `client/src/App.jsx` and `client/src/pages/HomePage.jsx`
- **Backend**: Read `server/server.js` and `server/controllers/itemController.js`
- **Database**: Check `server/models/`
- **Deployment**: See `DEPLOYMENT.md`

---

## 🎯 Project Goals Checklist

- ✅ MERN stack architecture
- ✅ Google OAuth with @thapar.edu restriction
- ✅ JWT token authentication
- ✅ Full CRUD operations
- ✅ Image upload to Cloudinary
- ✅ Responsive design (Tailwind CSS)
- ✅ Search & filtering
- ✅ Rating system
- ✅ Seller profiles
- ✅ Email contact integration
- ✅ Database seeding
- ✅ Production deployment guide
- ✅ Modular, well-commented code

---

## 🎉 You're All Set!

**Happy coding! If you have questions:**
- Check README.md for detailed docs
- Check DEPLOYMENT.md for production setup
- Look at code comments for explanations
- Review API examples in backend routes

**Campus Market is ready to go! 🏪**
