#!/bin/bash

# Quick deployment script for cPanel
# Run this after uploading files to server

echo "🚀 Starting WhiteLabelPortal deployment..."

# Check if running on server
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.production..."
    cp .env.production .env
    echo "✅ Please edit .env with your actual cPanel credentials!"
    echo "📝 Edit command: nano .env"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production || { echo "❌ npm install failed"; exit 1; }

# Build application
echo "🔨 Building application..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads logs
chmod 755 uploads logs

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:push || echo "⚠️  Migration failed - please check database connection"

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure Node.js app in cPanel (Application Manager)"
echo "2. Set environment variables in cPanel"
echo "3. Start the application"
echo "4. Visit your domain to test"
