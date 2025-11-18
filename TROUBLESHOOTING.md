# 🔧 Development Troubleshooting Guide

Common issues and solutions while developing Campus Market.

## 🚀 Startup Issues

### Backend Won't Start

**Error: `EADDRINUSE: address already in use :::5000`**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9
# Then restart
npm run dev
```

**Error: `Cannot find module dotenv`**
```bash
# Install missing dependencies
cd server
npm install
npm run dev
```

**Error: `MongooseError: Cannot connect to MongoDB`**
- Check `MONGODB_URI` in `.env` is correct
- Verify MongoDB Atlas is accepting connections
- Whitelist your IP address in MongoDB Atlas
- Ensure database user password is correct

### Frontend Won't Start

**Error: `EADDRINUSE: address already in use :::5173`**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
# Then restart
npm run dev
```

**Error: `Cannot find module 'react'`**
```bash
cd client
npm install
npm run dev
```

**Error: `VITE_GOOGLE_CLIENT_ID is undefined`**
- Create `client/.env` from `client/.env.example`
- Add your Google Client ID
- Restart dev server

---

## 🔐 Authentication Issues

### Google Login Not Working

**Error: "Invalid Client ID"**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Verify Client ID matches in `.env`
3. Check authorized JavaScript origins include `http://localhost:5173`
4. Refresh page and try again

**Error: "Only @thapar.edu emails allowed"**
- Verify you're using a Google account with @thapar.edu email
- Check backend validation in `authController.js`
- Ensure email matches exactly (case-sensitive)

**Login Redirects Back to Login Page**
- Check JWT token is being saved: Open DevTools → Application → LocalStorage
- Verify `VITE_API_URL` points to correct backend
- Check browser console for API errors

**JWT Token Expired**
- Normal - tokens expire after 7 days
- Just login again to get new token
- For development, change `expiresIn: '7d'` in authController.js

---

## 🖼️ Image Upload Issues

### Image Upload Fails Silently

**Error: "No file provided"**
- Check file input is accepting files
- Ensure `accept="image/*"` is set

**Error: "File size must be less than 5MB"**
- Compress image before uploading
- Maximum size is 5MB

**Error: "Invalid image format"**
- Only JPG, PNG, GIF are allowed
- Convert image to JPG/PNG and try again

**Images Show as Broken Links**

1. Check Cloudinary credentials in `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

2. Verify upload middleware is working:
   - Add `console.log(req.file)` before saving
   - Check server logs for upload confirmation

3. Test Cloudinary API directly:
   ```bash
   curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
     -F "file=@image.jpg" \
     -F "api_key=YOUR_API_KEY"
   ```

---

## 🔄 API Integration Issues

### Frontend Can't Connect to Backend

**Error: "Failed to fetch" / Network error**
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check `VITE_API_URL` in `client/.env`
3. Check CORS configuration in `server.js`

**Error: 401 Unauthorized**
- JWT token is missing or expired
- Check `Authorization` header in API calls
- Look at `api.js` interceptor - it should add token

**Error: 403 Forbidden**
- User doesn't own the resource
- Can't delete/update items you didn't create
- Can't review your own items

### CORS Errors

**Error: `Access to XMLHttpRequest... blocked by CORS`**
```javascript
// In server.js, check CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

**Solution:**
1. Ensure `process.env.FRONTEND_URL` matches your frontend URL
2. Restart backend after changing `.env`
3. Clear browser cache and try again

---

## 📊 Database Issues

### Can't Connect to MongoDB

**Error: `MongooseError: Cannot connect to localhost:27017`**
- You're trying to connect to local MongoDB
- Use MongoDB Atlas instead (see README.md)

**Error: `MongoAuthenticationFailed`**
- Wrong username or password
- Special characters in password need URL encoding
- Example: `pass@word` → `pass%40word`

**Error: `Error: connect ECONNREFUSED 127.0.0.1:27017`**
- MongoDB Atlas IP not whitelisted
- Add `0.0.0.0/0` to IP whitelist in MongoDB Atlas

**Seed Data Not Appearing**

```bash
# Clear database and reseed
cd server
npm run seed

# Check if seed ran successfully
# Should see: "✅ Database seeding completed successfully!"
```

### Database Queries Slow

**Solution: Add Indexes**
```javascript
// In User.js model
userSchema.index({ email: 1 });

// In Item.js model
itemSchema.index({ category: 1 });
itemSchema.index({ sellerId: 1 });
```

---

## 🎨 Frontend Display Issues

### Page Layout Broken

**Solution: Clear Tailwind Cache**
```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

**Images Not Displaying**
- Check image URL is valid (right-click → Open Image)
- Verify CORS allows image access
- Check browser console for 404 errors

### Search Filter Not Working

**Items Always Same Count**
1. Check filter query parameters are being sent
2. Log in browser: `console.log(params)` in `HomePage.jsx`
3. Check backend filter logic in `itemController.js`

**Sort Not Working**
- Verify sort option is valid: `newest`, `price-asc`, `price-desc`, `rating`
- Check sort implementation in controller

---

## 💾 LocalStorage Issues

### Token Not Persisting

**Problem: Logged out after page refresh**
1. Check DevTools → Application → LocalStorage
2. Verify `token` key exists
3. Check token is valid JWT

**Solution:**
```javascript
// In AuthContext.jsx
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token found:', token.substring(0, 20) + '...');
  }
}, []);
```

### Clear All Local Data

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🐛 Debugging Tips

### Use Browser DevTools

1. **Network Tab**
   - Check API requests
   - Verify request/response payloads
   - Look for CORS errors

2. **Console Tab**
   - Check for JavaScript errors
   - Look for network error messages
   - Test code snippets

3. **Application Tab**
   - Verify LocalStorage (token)
   - Check Cookies
   - Inspect cached data

### Server-Side Logging

```javascript
// Add debugging in controllers
console.log('Request received:', req.body);
console.log('User ID:', req.userId);
console.log('Response sent:', response);
```

### Use REST Client

Install VS Code extension: REST Client

Create `test.http`:
```http
@baseUrl = http://localhost:5000/api
@token = your_jwt_token_here

### Get all items
GET {{baseUrl}}/items

### Create item
POST {{baseUrl}}/items
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Test Item",
  "price": 500,
  "category": "Books",
  "description": "Test description"
}
```

---

## 🚀 Performance Issues

### Slow Page Loading

1. **Check Network Tab**
   - Sort by slowest requests
   - Identify which API call is slow

2. **Database Queries**
   ```javascript
   // Add timing logs
   console.time('query');
   const items = await Item.find(filter);
   console.timeEnd('query');
   ```

3. **Image Optimization**
   - Compress images before uploading
   - Use WebP format if supported

### High Memory Usage

```bash
# Monitor Node process
node --max-old-space-size=4096 server.js

# Check memory in server logs
const used = process.memoryUsage();
console.log('Memory:', Math.round(used.heapUsed / 1024 / 1024), 'MB');
```

---

## 🔄 Hot Reload Not Working

### Frontend

**Solution:** Vite auto-refresh not working
```bash
# Restart dev server
npm run dev

# Clear Vite cache
rm -rf .vite node_modules/.vite
npm run dev
```

### Backend

**Solution:** Nodemon not detecting changes
```bash
# Check nodemon is installed
npm install --save-dev nodemon

# Add to package.json scripts
"dev": "nodemon server.js"

# Restart
npm run dev
```

---

## 📝 Log Output Examples

### Successful Backend Startup
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

### Successful Item Creation
```
Request received: { title: "Book", price: 500, ... }
User ID: 60d5ec49c1234567890abcd
Item saved: { _id: "60d5ec49c1234567890xyz", ... }
Response sent: { message: "Item created successfully", item: {...} }
```

---

## 🆘 Still Having Issues?

1. **Check the main README.md** - Most questions answered there
2. **Review code comments** - Explain logic and assumptions
3. **Check Git history** - See recent changes that might have broken things
4. **Isolate the problem** - Is it frontend, backend, or database?
5. **Google the error** - Often someone else had the same issue

---

**Happy Debugging! 🐛 Remember: The error message usually tells you what's wrong!**
