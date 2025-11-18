#!/bin/bash

# Campus Market - Setup Script
# This script sets up the development environment

echo "🏪 Campus Market - Development Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd server

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update server/.env with your credentials"
fi

echo "Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
cd ../client

echo "📦 Setting up Frontend..."

if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update client/.env with your credentials"
fi

echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "========================================="
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update server/.env with your credentials"
echo "   - MongoDB URI"
echo "   - Google OAuth credentials"
echo "   - Cloudinary credentials"
echo "   - JWT_SECRET"
echo ""
echo "2. Update client/.env with your credentials"
echo "   - Google Client ID"
echo "   - API URL"
echo ""
echo "3. Start development servers:"
echo "   - Backend: cd server && npm run dev"
echo "   - Frontend: cd client && npm run dev"
echo ""
echo "4. (Optional) Seed database: cd server && npm run seed"
echo ""
echo "📖 Read README.md for detailed documentation"
echo "========================================="
