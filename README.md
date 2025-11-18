# Campus Market - MERN Marketplace for Thapar Community

🏪 A full-stack MERN web application for buying and selling second-hand items within the Thapar University community.

## 📋 Features

### 🔐 Authentication & Security
- **Google OAuth Login** - Restricted to @thapar.edu email domain only
- **JWT Token-based Session Management** - Secure API authentication
- **Auto-registration** - First-time users are automatically registered

### 🛍️ Marketplace Features
- **Browse Listings** - Search and filter items by category, price, and rating
- **Post Items** - Create listings with image upload (Cloudinary)
- **Item Details** - View full item info with seller profile
- **Rating System** - Rate sellers and items (1-5 stars)
- **Seller Profile** - View seller's statistics and reviews
- **Contact Seller** - Email integration for direct communication

### 📱 User Interface
- **Responsive Design** - Works on desktop and mobile (Tailwind CSS)
- **Modern & Minimalist** - Clean UI with intuitive navigation
- **Real-time Search** - Filter items as you type
- **Image Gallery** - Upload and display product images

## 🏗️ Project Structure

```
campus-market/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Route pages (Home, Login, ItemDetails, etc.)
│   │   ├── components/       # Reusable components (Navbar, ItemCard, etc.)
│   │   ├── services/         # API service layer (api.js)
│   │   ├── context/          # Context API (AuthContext.jsx)
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles with Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                    # Node.js Backend
│   ├── models/               # Mongoose schemas (User, Item, Review)
│   ├── controllers/          # Business logic (auth, items, reviews)
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth & upload middleware
│   ├── config/               # Database configuration
│   ├── scripts/              # Seed data script
│   ├── server.js             # Express server setup
│   ├── package.json
│   └── .env.example
│
├── README.md                 # This file
└── LICENSE
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+) and npm
- MongoDB Atlas account (free tier available)
- Google OAuth credentials
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-market
   JWT_SECRET=your_super_secret_key_here
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. **Seed the database** (optional, for test data)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (from `.env.example`)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### `POST /auth/google`
**Google OAuth Login**
- **Request**: `{ token: "google_token_string" }`
- **Response**: `{ token: "jwt_token", user: {...} }`
- **Validation**: Email must be @thapar.edu domain

#### `GET /auth/me`
**Get Current User Profile** (Protected)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: User profile data

### Items Endpoints

#### `GET /items`
**Get All Items**
- **Query Parameters**:
  - `search` - Search in title/description
  - `category` - Filter by category (Books, Electronics, etc.)
  - `minPrice`, `maxPrice` - Price range filter
  - `sort` - Sort by: newest, price-asc, price-desc, rating

#### `GET /items/:id`
**Get Item Details**
- **Includes**: Seller info and reviews

#### `POST /items`
**Create New Item** (Protected)
- **Form Data**:
  - `title` - Item title
  - `description` - Item description
  - `price` - Price in rupees
  - `category` - Category (Books, Electronics, etc.)
  - `image` - Image file (Multer/Cloudinary)

#### `PUT /items/:id`
**Update Item** (Protected, Owner Only)

#### `DELETE /items/:id`
**Delete Item** (Protected, Owner Only)

### Reviews Endpoints

#### `POST /reviews/:itemId`
**Add Review** (Protected)
- **Request**: `{ rating: 1-5, comment: "text" }`
- **Validation**: Can't review own items

#### `GET /reviews/item/:itemId`
**Get Item Reviews**
- **Response**: Reviews with rating statistics

#### `GET /reviews/seller/:sellerId`
**Get Seller Statistics**
- **Response**: Average rating, items sold, review distribution

## 🗄️ Database Schema

### Users Collection
```javascript
{
  googleId: String (unique),
  name: String,
  email: String (unique, @thapar.edu),
  photoURL: String,
  averageRating: Number,
  itemsSold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Items Collection
```javascript
{
  title: String,
  description: String,
  price: Number,
  category: String (enum),
  imageURL: String,
  sellerId: ObjectId (ref: User),
  status: String (active, sold, removed),
  averageRating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection
```javascript
{
  itemId: ObjectId (ref: Item),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Deploy Frontend on Vercel

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Go to [Vercel.com](https://vercel.com)**
   - Sign in with GitHub
   - Import the repository
   - Set environment variables:
     - `VITE_API_URL` = Your backend URL (from Render)
     - `VITE_GOOGLE_CLIENT_ID` = Google OAuth ID
   - Click Deploy

### Deploy Backend on Render

1. **Push code to GitHub**

2. **Go to [Render.com](https://render.com)**
   - Create new Web Service
   - Connect GitHub repository
   - Set environment variables:
     - `MONGODB_URI` = MongoDB Atlas connection
     - `JWT_SECRET` = Strong secret key
     - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
     - `CLOUDINARY_*` credentials
     - `FRONTEND_URL` = Your Vercel URL
     - `NODE_ENV` = production
   - Click Deploy

### MongoDB Atlas Setup (Free Tier)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user (username/password)
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/campus-market`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web Application)
3. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-vercel-url.vercel.app` (production)
4. Add authorized redirect URIs:
   - Same URLs as above
5. Copy Client ID and Secret

### Cloudinary Setup (Free Tier)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get API credentials from dashboard
4. Set upload preset (optional, for unsigned uploads)

## 💻 Key Technologies

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Google OAuth 2.0** - Authentication
- **Lucide React** - Icon library

### Backend
- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database & ODM
- **JWT** - Token authentication
- **Multer & Cloudinary** - Image upload & storage
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration

## 📝 Code Standards

### Comments
- Every function has a JSDoc comment explaining purpose
- Complex logic includes inline comments
- Database models have field descriptions

### Error Handling
- Try-catch blocks in all async operations
- Meaningful error messages returned to client
- Validation on both frontend and backend

### Security
- JWT tokens expire in 7 days
- Google OAuth restricted to @thapar.edu
- Multer validates file types and size
- No sensitive data in response objects
- Environment variables for all secrets

## 🔍 Testing the App

### Test Users
After running `npm run seed`, these users are available:

1. **raj.kumar@thapar.edu** - 5 items sold, 4.5 rating
2. **priya.singh@thapar.edu** - 8 items sold, 4.8 rating
3. **arjun.patel@thapar.edu** - 3 items sold, 4.2 rating

### Test Flow
1. Visit `http://localhost:5173`
2. Click Login
3. Sign in with Google (@thapar.edu email)
4. Create a new item with `/post` route
5. View item details and add reviews
6. Check your profile at `/profile`

## 🐛 Troubleshooting

### "Only @thapar.edu emails allowed"
- Ensure you're using a Google account with @thapar.edu email
- Check `VITE_GOOGLE_CLIENT_ID` is correct

### Images not uploading
- Verify Cloudinary credentials in `.env`
- Check file size < 5MB
- Confirm image format (JPG, PNG, GIF)

### API calls failing
- Check backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in `.env.local`
- Check CORS configuration in `server.js`

### Database connection error
- Verify MongoDB Atlas connection string
- Check IP whitelist (0.0.0.0/0 for dev)
- Ensure database user has correct password

## 📞 Support & Contact

For issues or feature requests, please open an issue on GitHub.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Thapar Community**

Happy coding! 🚀
# campus-marketplace2.0
