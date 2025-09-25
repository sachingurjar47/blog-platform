#!/bin/bash

# Deployment script for Blog Platform

echo "🚀 Starting deployment process..."

# Check if JWT_SECRET is set
if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET environment variable is not set"
    echo "Please set JWT_SECRET before deploying:"
    echo "export JWT_SECRET=your_super_secure_jwt_secret_key_here"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Check if we're deploying to Vercel
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
elif command -v netlify &> /dev/null; then
    echo "🚀 Deploying to Netlify..."
    netlify deploy --prod
else
    echo "⚠️  No deployment platform detected."
    echo "Please install Vercel CLI or Netlify CLI:"
    echo "npm install -g vercel"
    echo "or"
    echo "npm install -g netlify-cli"
fi

echo "🎉 Deployment process completed!"
